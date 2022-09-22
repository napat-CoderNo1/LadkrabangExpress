const mongoose = require("mongoose");
const ticketModel = require("../model/ticket.js");
const trainModel = require("../model/train.js");
const userModel = require("../model/user.js");
const User = require("./userDAO.js");
const Train = require("./trainDAO");
const fs = require("fs");
const user = require("../model/user.js");

class Ticket {
  static async addTicket(req, res) {
    try {
      let {
        token,
        train_id,
        date,
        origin,
        destination,
        passenger,
        reservation_class,
        departureTime,
        arrivalTime,
        seat_reservation,
        food_reservation
      } = req.body;
      console.log(req.body);
      let user_id = User.verifyTokenGetUserID(token)
      if (user_id === false) {
        res.send("token expired").status(201);
        return;
      }

      train_id = mongoose.Types.ObjectId(train_id);
      user_id = mongoose.Types.ObjectId(user_id);
      const d = new Date(date);
      const userAddTicket = await userModel.findById(user_id);

      let ticketPrice = 0;
      let reservationPrice = 0;
      let seatLayout = Object;
      if (seat_reservation.length > 0) {
        reservationPrice = 10;
      }
      ticketPrice = await Train.calculatePriceClass(
        reservation_class,
        origin,
        destination
      );
      const foodPrice = Ticket.calculateFoodPrice(food_reservation)
      let totalPrice = (passenger * ticketPrice) + reservationPrice + foodPrice
      const trainNumber = await trainModel.findById(
        mongoose.Types.ObjectId(train_id)
      );
      //สร้าง doc ลง database
        const localTime = new Date()

      const ticketAdded = new ticketModel({
        user_id: user_id, //,required:true
        username: userAddTicket.username,
        train_id: train_id, //,required:true
        train_number: trainNumber.train_number,
        origin: origin, //,required:true
        destination: destination, //,required:true
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        date: d,
        passenger: passenger, //,required:true
        reservation_class: reservation_class,
        seat_reservation: seat_reservation,
        ticketPrice: ticketPrice,
        reservation_price: reservationPrice,
        food_reservation: food_reservation,
        food_price: foodPrice,
        total_price: totalPrice,
        timestamp: localTime.toLocaleString("th-TH")
      });

      ticketAdded.save();
      // userAddTicket.ticket.push(ticketAdded._id);
      // userAddTicket.save();

      res.send(ticketAdded);
    } catch (err) {
      console.log(err);
      res.send("Error in backend");
    }
  }

  static async makeSeatLayout(req, res) {
    //trainID, d
    try {
      let { trainID, date } = req.body;
      // console.log(req.params)
      trainID = mongoose.Types.ObjectId(trainID);
      date = new Date(date);

      const exitTicket = await Ticket.findReservedSeat(trainID, date);
      let reservedSeat = Ticket.filterOnlySeat(exitTicket);

      const rawdata = fs.readFileSync("./doc/seatLayout.json");
      let jsonTemp = JSON.parse(rawdata);
      // console.log(jsonTemp)

      //Do main function

      const columnTemp = ["A", "B", "C", "D"];
      const thatTrain = await trainModel.findById(trainID);
      let numberOfCoach = 0;
      const seatRowPerCoach = 16;
      const seatPerRow = 4;
      let tempClass = 0;
      if (thatTrain.class_in_train.class_2.class_available == true) {
        console.log("cat");
        numberOfCoach = 3;
        tempClass = 2;
      } else if (thatTrain.class_in_train.class_3.class_available == true) {
        numberOfCoach = 5;
        tempClass = 3;
      }

      let result = [];

      for (let i = 0; i < numberOfCoach; i++) {
        //coach
        let temp = [];
        for (let j = 0; j < seatRowPerCoach; j++) {
          //
          for (let k in columnTemp) {
            let isReserv = false;
            for (let a = 0; a < reservedSeat.length; a++) {
              // if({ "coach": i+1, "row": j+1, "column": columnTemp[k]} == reservedSeat[a]){

              if (
                reservedSeat[a].coach == i + 1 &&
                reservedSeat[a].row == j + 1 &&
                reservedSeat[a].column == columnTemp[k]
              ) {
                isReserv = true;
                console.log(k);
                break;
              }
            }

            temp.push({
              row: j + 1,
              column: columnTemp[k],
              isReserv: isReserv,
            });
          }
        }
        result.push({
          class: tempClass,
          coach: i + 1,
          seat: temp,
        });
      }
      // console.log(result)
      res.send(result);
    } catch (err) {
      console.log(err);
      res.send("Error in backend");
    }
  }

  static async findReservedSeat(trainID, date) {
    return await ticketModel.find({
      $and: [{ train_id: trainID }, { date: date }],
    });
  }

  static filterOnlySeat(exitTicket) {
    let result = [];
    for (let i in exitTicket) {
      for (let j in exitTicket[i].seat_reservation) {
        result.push({
          coach: exitTicket[i].seat_reservation[j].coach,
          row: exitTicket[i].seat_reservation[j].row,
          column: exitTicket[i].seat_reservation[j].column,
        });
      }
    }
    return result;
  }

  static calculateFoodPrice(food){
    let resultPrice = 0
    for(let i = 0 ; i < food.length ; i++){
      resultPrice += Number(food[i].amount) * Number(food[i].price)
    }
    return resultPrice
  }

}

module.exports = Ticket;
