import { gql } from "apollo-server-express";

const typeDefs = `
scalar GQLDate
scalar DateTime

enum ItemType {
  ROOM
  EVENT
  FLIGHT
}

type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    registeredDate: GQLDate!
    totalCartPrice: Float! # Computed field for total price
    cart: [CartItem] #to differentiate between flights and events and rooms
    password: String!
    bookings: [Booking]
    token:String
    role: String!
}

input InputUser {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  phoneNumber: String!
}


type CartItem
{
id:ID!
itemId:ID!
itemType:String!
quantity:Int
nights:Int
price:Float!
name:String
description:String
location:String
}

type Room {
  id: ID!
  roomName: String!
  personsPerRoom: Int!
  phoneNumber: String!
  rentPerNight: Float!
  imageUrls: [String!]!
  currentBookings: [String]
  location: String!
  checkIn:GQLDate
  checkOut:GQLDate
  description: String!
  createdAt: GQLDate!
}

input InputRoom {
  roomName: String!
  personsPerRoom: Int!
  phoneNumber: String!
  rentPerNight: Float!
  imageUrls: [String!]!
  location: String!
  checkIn:GQLDate!
  checkOut:GQLDate!
  description: String!
}

input UpdateRoomInput {
  roomName: String
  personsPerRoom: Int
  phoneNumber: String
  rentPerNight: Float
  imageUrls: [String!]
  checkIn:GQLDate
  checkOut:GQLDate
  location: String
  description: String
}



type Flight
{
  id: ID!
  airline: String!
  departureLocation: String!
  arrivalLocation: String!
  departureTime: DateTime!
  arrivalTime: DateTime!
  price: Float!
  availableSeats: Int!
  createdAt: GQLDate!
}

  input InputFlight {
    airline: String!
    departureLocation: String!
    arrivalLocation: String!
    departureTime: String!
    arrivalTime: String!
    price: Float!
    availableSeats: Int!
  }


input UpdateFlightInput {
  airline: String
  departureLocation: String
  arrivalLocation: String
  departureTime: String
  arrivalTime: String
  price: Float
  availableSeats: Int
}

type Event {
  id: ID!
  name: String!
  location: String!
  description: String
  imageUrls: [String!]!
  currentBookings: [String]
  price: Float!
  checkIn:GQLDate
  checkOut:GQLDate
  createdAt: GQLDate!
}

input InputEvent {
    name: String!
    location: String!
    price: Float!
    imageUrls: [String!]!
    checkIn:GQLDate!
    checkOut:GQLDate!
    description: String
}

input UpdateEventInput {
    name: String
    location: String
    description: String
    price: Float
    imageUrls: [String!]
    checkIn:GQLDate
    checkOut:GQLDate
}

type Booking {
  id: ID!
  userId: ID!
  itemId: ID!
  itemType: ItemType!
  quantity: Int
  nights: Int
  totalPrice: Float!
  bookingDate: GQLDate!
}


type Admin {
id:ID!
email:String!
role: String!
}

type AuthPayload {
  token: String
  user:User!
}

type AdminAuthPayload
{
    token: String
    admin:Admin
}

type RemoveCartResponse {
  success: Boolean!
  message: String
  updatedCart: [CartItem]!  # Add this field to return the updated cart
}

type Query {
    me:User
    getUsers: [User!]!
    getRooms: [Room!]!
    getRoom(id: ID!): Room
    getFlights:[Flight]
    getFlight(id:ID!):Flight
    getEvents:[Event!]!
    getEvent(id:ID!):Event
    getUserCart: [CartItem!]!
}
type Mutation {
    #USER AUTH
    register(user: InputUser!): AuthPayload!
    login(email:String!, password:String!):AuthPayload!
    #ADMIN AUTH
    adminLogin(email:String!, password:String!):AdminAuthPayload
    #ADMIN FUNCTIONALITITES
    
    addRoom(room: InputRoom!): Room!
    deleteRoom(id: ID!): String
    updateRoom(id: ID!, room: UpdateRoomInput!): Room!

    #FLIGHT 
    addFlight(flight:InputFlight!):Flight!
    deleteFlight(id: ID!): String
    updateFlight(id: ID!, flight: UpdateFlightInput!): Flight!

    #Event queries
    addEvent(event:InputEvent!):Event!
    deleteEvent(id:ID!):String
    updateEvent(id:ID!,event:UpdateEventInput!):Event!

    # Cart management ROOM (for authenticated users)
    addRoomToCart(roomId: ID!, checkIn: GQLDate, checkOut: GQLDate, nights: Int): Room
    removeFromCart(itemId: ID!): RemoveCartResponse!

    # Cart management EVENT
    addEventToCart(eventId: ID!): Event
    removeFlightFromCart(flightId: ID!): String

    # Cart management FLIGHT
    addFlightToCart(flightId: ID!): Flight
    removeEventFromCart(eventId: ID!): String
    

    addBooking(cartItemIds: [ID!]!): Booking! #convert cartitems to bookins
}


union Item = Event | Room |Flight
`;
export default typeDefs;
