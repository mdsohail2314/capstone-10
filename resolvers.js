import { GraphQLScalarType, Kind } from 'graphql';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import Admin from '../models/Admin.js' 
import Room from '../models/Room.js'
import Event from '../models/Event.js'

const GQLDate = new GraphQLScalarType({
  name: 'GQLDate',
  description: 'Custom Date type',
  serialize(value) {
    return value.toISOString().slice(0, 10); // Converts Date object to string (e.g., "2025-01-01")
  },
  parseValue(value) {
    return new Date(value); // Converts string input (e.g., "2025-01-01") to Date object
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : undefined;
  },
});


const resolvers = {
  GQLDate,
  Query: {
    me:async(_,__,{user })=>{
      if (!user) throw new Error("Not authenticated");
      return User.findById(user.id)
    },
    getUsers: async () => {
      return await User.find({});
    },
    getRooms:async()=>{
      return await Room.find({});
    },
    getRoom:async(_,{id})=>{
      return await Room.findById(id);
    },
    // Get list of flights
    getFlights: async () => {
      return await Flight.find({});
    },
    getFlight: async (_, { id }) => {
      return await Flight.findById(id);
    },  
    // Get list of Events
    getEvents:async ( )=> {
      return await Event.find({});
    },
    getEvent:async(_,{id})=>{
      return await Event.findById(id);
    },
    getUserCart: async (_, __, { user }) => {
      console.log("userId" +user.id)
      if (!user || !user.id) throw new Error('Not authenticated');
  
      const userId = user.id; 
      const foundUser = await User.findById(userId).populate('cart');
      
      console.log("Found user cart:", foundUser.cart); 
      return foundUser.cart;
    },
    
  },
  Mutation: {
    register: async (_, { user }) => {
      const { firstName, lastName, email, password, phoneNumber } = user;

        // Check if email already exists
      const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('Email is already taken');
        }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser=new User({firstName, lastName, email, password:hashedPassword, phoneNumber});
      await newUser.save();

      const token=jwt.sign({id:newUser.id, email:newUser.email}, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
      return { 
        user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
      token
    };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email});
      if (!user) throw new Error('User not found');
      const isValid=await bcrypt.compare(password, user.password);
      if(!isValid) throw new Error("Invalid Credentials");
      const token=jwt.sign({
        id:user.id,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        role:user.role
      },process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "1h"});
      console.log('Generated JWT Token:', token);
      return {token,
        user:{
          id:user.id,
          firstName:user.firstName,
          lastName:user.lastName,
          email:user.email,
          phoneNumber:user.phoneNumber,
          role:user.role
        }
      };
    },

    adminLogin : async(_,{email,password})=>{
      const admin=await Admin.findOne({email});
      if(!admin) throw new Error("Admin not found");

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) throw new Error("Incorrect password");
      console.log('Logged in Admin:', admin);
      console.log('Admin Role:', admin.role);
      const token = jwt.sign({ 
        id: admin.id, email: admin.email, role: admin.role
       }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
      console.log('Generated JWT Token for admin:', token);
      return {
        token,
         admin:{
          id:admin.id, 
          email:admin.email, 
          role:admin.role
        } 
        };
    },
    /**ROOM CRUD OPERATIONS */
    addRoom:async(_,{room},{user})=>{
      console.log("User in addRoom resolver:", user.role);
      if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");

      const newRoom = new Room(room);
      await newRoom.save();
      return newRoom;
    },

    updateRoom: async (_,{id,room},{user}) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");

      const existingRoom = await Room.findById(id);
      if (!existingRoom) throw new Error("Room not found");
      Object.assign(existingRoom, room);
      await existingRoom.save();
      return existingRoom;
    }, 
    deleteRoom:async(_,{id},{user})=>{
      if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
      await Room.findByIdAndDelete(id);
      return "Room Deletion successfull";
    },

    addRoomToCart: async (_, { roomId, checkIn, checkOut}, { user }) => {
      if (!user) throw new Error('User must be logged in to add items to cart');
    
      const room = await Room.findById(roomId);
      if (!room) throw new Error('Room not found');
    
      const currentUser = await User.findById(user.id);
      if (!currentUser) throw new Error('User not found');
    
      // Ensure the cart exists
      if (!Array.isArray(currentUser.cart)) {
        currentUser.cart = [];
      }
    
      // Check if the room is already in the cart
      const isAlreadyInCart = currentUser.cart.some(
        (item) => item.itemId.toString() === roomId.toString() && item.itemType === "Room"
      );
    
      if (isAlreadyInCart) {
        throw new Error('This room is already in your cart');
      }

        // Convert checkIn and checkOut to Date objects
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Calculate the number of nights
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24)); // Convert ms to days

          // If the nights are less than or equal to 0, throw an error
      if (nights <= 0) {
      throw new Error('Check-out date must be after check-in date');
      }
    
      // Add the room to the cart with additional info (checkIn, checkOut, nights)
      const cartItem = {
        itemId: roomId.toString(),
        itemType: "Room",
        checkIn,
        checkOut,
        nights,
        price: room.rentPerNight,
        name: room.roomName,
        location: room.location,
        description: room.description,
      };
    
      currentUser.cart.push(cartItem);
  // Calculate the total price for all items in the cart
      const totalPrice = currentUser.cart.reduce((total, item) => {
      const nights = item.nights || 1; // Default to 1 if nights is not set
      return total + (item.price * nights); // Add the price for this item
      }, 0);
      // Update the total price field
      currentUser.totalPrice = totalPrice;    
      await currentUser.save();
      return room;  // Returning the full Room object
    },      
    
    /**EVENT CRUD OPERATIONS */
    addEvent:async(_,{event},{user})=>{
      console.log("User in addEvent resolver:", user.role);
      if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
        const newEvent=new Event(event);
        await newEvent.save();
        return newEvent;
    },
    updateEvent:async(_,{id,event},{user})=>{
      if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
      const existingEvent=await Event.findById(id);
      if(!existingEvent) throw new Error("Event Not Found");
      Object.assign(existingEvent,event);
      await existingEvent.save();
      return existingEvent;
    },
    deleteEvent:async(_,{id},{user})=>{
      if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
      await Event.findByIdAndDelete(id);
      return "Event Deletion successfull";
    },
    removeFromCart: async (_, { itemId }, { user }) => {
      const foundUser = await User.findById(user.id); // Make sure to use the correct 'user' object from context
      const itemIndex = foundUser.cart.findIndex(item => item.itemId.toString() === itemId);

      if (itemIndex === -1) {
        return { success: false, message: "Item not found in cart." };
      }

      // Remove the item from the cart
      foundUser.cart.splice(itemIndex, 1);
      await foundUser.save();

      return {
        success: true,
        message: "Item removed from cart.",
        updatedCart: foundUser.cart  // Return the updated cart here
      };
    },
    addEventToCart: async (_, { eventId }, { user }) => {
      console.log("User details:", user);
      if (!user) throw new Error('User must be logged in to add items to cart');
    
      const event = await Event.findById(eventId);
      if (!event) throw new Error('Event not found');
    
      const currentUser = await User.findById(user.id);
      if (!currentUser) throw new Error('User not found');
    
      // Ensure the cart exists
      if (!Array.isArray(currentUser.cart)) {
        currentUser.cart = [];
      }
    
      // Check if the event is already in the cart
      const isAlreadyInCart = currentUser.cart.some(
        (item) => item.itemId.toString() === eventId.toString() && item.itemType === "Event"
      );
    
      if (isAlreadyInCart) {
        throw new Error('This event is already in your cart');
      }

      const checkIn = event.checkIn;  // Assuming event schema has checkIn
      const checkOut = event.checkOut;  // Assuming event schema has checkOut
    
  if (!checkIn || !checkOut) {
    throw new Error('Event must have check-in and check-out dates.');
  }

  
         // Convert checkIn and checkOut to Date objects
         const checkInDate = new Date(checkIn);
         const checkOutDate = new Date(checkOut);

      // Calculate the number of nights
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24)); // Convert ms to days

          // If the nights are less than or equal to 0, throw an error
      if (nights <= 0) {
      throw new Error('Check-out date must be after check-in date');
      }
      
         
      // Add the event to the cart with additional info (checkIn, checkOut, nights)
      const cartItem = {
        itemId: eventId.toString(),
        itemType: "Event",
        price: event.price,
        name: event.name,
        nights,
        location: event.location,
        description: event.description,
      };
    
      currentUser.cart.push(cartItem);
      await currentUser.save();
    
      return event;  // Returning the full Event object
    },
  },
};

export default resolvers;
