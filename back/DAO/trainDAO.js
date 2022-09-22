const trainModel = require('../model/train.js')
const ticketModel = require('../model/ticket')
const mongoose = require('mongoose')
const fs = require('fs')
const csv = require('csv-parser')

class Train{
    static async add(req,res){
        try{
            // console.log(req.body)
            const service_date = Object
            if(req.body.service_date != null){
                service_date = new Date(req.body.service_date)
            }
            
            const trainAdded = new trainModel({
                train_number : req.body.train_number,
                train_name : req.body.train_name,
                stand_ticket_available: req.body.stand_ticket_available,
                service_date: service_date,
                service_day: req.body.service_day,
                class_in_train: {
                    class_1: {
                        class_available: req.body.class_in_train.class_1.class_available,
                        remain_seat: req.body.class_in_train.class_1.remain_seat
                    },
                    class_2: {
                        class_available: req.body.class_in_train.class_2.class_available,
                        remain_seat: req.body.class_in_train.class_2.remain_seat
                    },
                    class_3: {
                        class_available: req.body.class_in_train.class_3.class_available,
                        remain_seat: req.body.class_in_train.class_3.remain_seat
                    },
                } ,
                
            })
            const tempStation = []
            for(let i of req.body.station){
                tempStation.push(i)
            }
            trainAdded.station = tempStation
            trainAdded.save()
            res.send("Sucess")
        }catch(err){
            console.log(err)
            res.send("error")
        }
        
    }

    static async customerFindTrain(req,res){
        //ใช้กับหน้า find your best train
        //input => origin, destination, time, date, passenger,dateReturn, timeReturn
        try{
            const { origin, destination, date, time, passenger, dateReturn, timeReturn } = req.body

            const foundTrainTemp = await trainModel.find({$and:[{"station.station_name": origin},{"station.station_name": destination}]})
            
            // console.log(foundTrainTemp)
            //เลือกแค่อันที่สถานีเป็นต้นทางกับปลายทางตามลำดับ
            let foundTrain = await Train.findTrainOrderStation(foundTrainTemp,origin, destination)
            foundTrain = await Train.filterDay(foundTrain,date)
            
            //Check class of train
            
            let trainSortTime = []
            // รันลูปเพื่อหาส่วนต่างเวลาของแต่ละ หมายเลข ขบวน
            for (let i=0; i<foundTrain.length; i++) {
                // หา origin ตรงกับที่ front ส่งมา
                for (let j=0; foundTrain[i].station[j]; j++) {
                    // console.log(foundTrain[i].station[j])
                    if (origin == foundTrain[i].station[j].station_name) {
                        // Get hours and minutes from DB
                        let hours = foundTrain[i].station[j].departure_hour
                        hours = String(hours)
                        let minutes = foundTrain[i].station[j].departure_minute
                        minutes = String(minutes)

                        // เติม 0
                        if (hours.length <= 1){
                            hours = "0"+hours
                        }
                        if (minutes.length <= 1){
                            minutes = "0"+minutes
                        }
                        
                        // format time from DB to HH:MM
                        const timeFromDB = hours+":"+minutes
                        
                        // time from front
                        const timeFromfront = String(time)
                        
                        const text1 = `2017-05-02T${timeFromDB}`
                        const text2 = `2017-05-02T${timeFromfront}`
                        const d1 = new Date(Date.parse(text1));
                        const d2 = new Date(Date.parse(text2));                     
                        const diff = Train.getDuration(d1, d2);                       
                        const timeDiff = parseFloat(diff.toString())
                        // // ทำเป็น object เพื่อยัดใส่ trainSortTime
                        let temp = foundTrain[i].toObject()
                        temp.diff = timeDiff
                        trainSortTime.push(temp)
                        
                    }
                    
                }
                
            }
            // console.log(foundTrain[foundTrain.length-1])
            trainSortTime.sort((a, b) => (a.diff > b.diff) ? 1 : -1)
            
            // Make JSON to front
            const filterTrainData = []
            for(let i in trainSortTime){

                //คำนวนราคาตั๋ว
                let price = await Train.calculatePrice(trainSortTime[i],origin,destination)
                
                //คำนวนราคาตั๋วรวม
                const totalPrice = Number(price) * Number(passenger)
                
                //คำนวนเวลาออกเดินทาง เวลาถึง และเวลาที่ใช้ในการเดินทาง
                let { deTime, arTime,duration} = await Train.findDepartureArrivalTime(trainSortTime[i].station,origin,destination)
                

                const time = deTime.split(":")
                if(time[1].length < 2){
                    time[1] = "0" + time[1]
                }
                deTime = time[0] + ":" + time[1]

                const timeA = arTime.split(":")
                if(timeA[1].length < 2){
                    timeA[1] = "0" + timeA[1]
                }
                arTime = timeA[0] + ":" + timeA[1]

                
                // console.log(h)
                
                //คำนวนที่นั่งที่ยังเหลือ
                //return object
                const classRemain = await Train.calculateSeatRemain(trainSortTime[i],date)
                // console.log(trainSortTime[i]._id)
                filterTrainData.push({
                    "train_id": trainSortTime[i]._id,
                    "trainNumber": trainSortTime[i].train_number,
                    "origin": origin, 
                    "destination": destination, 
                    "departureTime": deTime, 
                    "arrivalTime": arTime, 
                    "duration": duration,
                    "date": date,
                    "day": trainSortTime[i].service_day,
                    "passenger": passenger,
                    "seatRemain":{
                        "class1": classRemain.class1,
                        "class2": classRemain.class2,
                        "class3": classRemain.class3
                    },
                    "ticketPrice": price,
                    "totalPrice": totalPrice
                    
                })
            }

            res.status(200).json(filterTrainData)
            
        }catch(err){
            console.log(err)
            res.send("error")
        }

    }

    static getDuration = function(d1, d2) {
        const d3 = new Date(Math.abs(d2 - d1));
        // console.log(d3)
        const d0 = new Date(0);
    
        return {
            getHours: function(){
                return d3.getHours() - d0.getHours();
            },
            getMinutes: function(){
                return d3.getMinutes() - d0.getMinutes();
            },
            toString: function(){
                return this.getHours() + "." +
                       this.getMinutes()    
            },
        };
    }

    static async showReservationSeat(req,res){
        const { train_id , date } = req.body

    }

    static findTrainOrderStation(foundTrainTemp,origin, destination){
        let foundTrain = []
        for(let i in foundTrainTemp){
            if((foundTrainTemp[i].station.findIndex( ({station_name}) => station_name === origin)) < (foundTrainTemp[i].station.findIndex( ({station_name}) => station_name === destination))) {
                foundTrain.push(foundTrainTemp[i])
            }
        }
        return foundTrain
    }

    static findDepartureArrivalTime(station,origin,destination) {
        
        let temp = station.find( ({station_name}) => station_name === origin)
        const deTimeH = temp.departure_hour
        const deTimeM = temp.departure_minute
        temp = station.find( ({station_name}) => station_name === destination)
        const arTimeH = temp.departure_hour
        const arTimeM = temp.departure_minute

        const deTime = deTimeH + ":" + deTimeM
        const arTime = arTimeH + ":" + arTimeM

        const duration = this.calculateTravelDuration(Number(deTimeH),Number(deTimeM),Number(arTimeH),Number(arTimeM))

        return { deTime, arTime,duration}
    }

    static calculateTravelDuration(deTimeH,deTimeM,arTimeH,arTimeM){
        let deltaH = 0
        let deltaM = 0
        if(arTimeM-deTimeM > 0){
            deltaH = arTimeH - deTimeH
            deltaM = arTimeM - deTimeM
        }else{
            arTimeH -= 1
            arTimeM += 60
            deltaH = arTimeH - deTimeH
            deltaM = arTimeM - deTimeM
        }
        deltaM = String(deltaM)

        if(deltaM.length < 2){
            deltaM = "0" + deltaM
        }
        return String(deltaH) + ":" + deltaM
    }

    static async test(req,res){
        try{
            // this.calculatePrice(req.body.origin,req.body.destination)
            const d1 = new Date("2022-04-23")
            const d2 = new Date("2022-04-24")
            console.log(d1 - d2)
            res.send("Good")
        }catch(err){
            console.log(err)
            res.send("error someting")
        }

    }

    static calculatePrice(foundTrain , origin , destination){
        // for(let i of foundTrain){
                
            // console.log(foundTrain.train_number)
            if(Boolean(foundTrain.class_in_train.class_3.class_available)){
                return Train.calculatePriceClass(3, origin, destination)
            }
            else if(Boolean(foundTrain.class_in_train.class_2.class_available)){
                return Train.calculatePriceClass(2, origin, destination)
            }
        // }
            
    }

    static calculatePriceClass(classAvailable,origin,destination){
        if(classAvailable == 3){
            let rawdata = fs.readFileSync('./doc/fare.json');
            let jsonTemp = JSON.parse(rawdata);
            for(let j in jsonTemp){       
                if(j == origin || j == destination){
                    for(let k in jsonTemp[j]){
                        if(k == origin || k == destination){
                            // console.log("-->" + jsonTemp[j][k])
                            return jsonTemp[j][k]
                        }
                    }
                }
            }
        }
        else if(classAvailable == 2){
            let rawdata = fs.readFileSync('./doc/fare2.json');
            let jsonTemp = JSON.parse(rawdata);
            for(let j in jsonTemp){       
                if(j == origin || j == destination){
                    for(let k in jsonTemp[j]){
                        if(k == origin || k == destination){
                            // console.log("-->" + jsonTemp[j][k])
                            return jsonTemp[j][k]
                        }
                    }
                }
            }
        }
    }

    static filterDay(foundTrain,date){
        const d = new Date(date);
        const day = d.getDay()
        // console.log(day)
        const result = []
        for(let i in foundTrain){
            if(foundTrain[i].service_day.includes(day)){
                // console.log(foundTrain[i].train_number + foundTrain[i].service_day)
                result.push(foundTrain[i])
            }
        }
        return result
        
    }

    static async calculateSeatRemain(train,date){
        const d = new Date(date)
        const exitTicket = await ticketModel.find({$and:[{"train_id": train._id},{"date": d}]})
        // console.log("cat" + exitTicket)
        let remain = {
            "class1": Number(train.class_in_train.class_1.remain_seat),
            "class2": Number(train.class_in_train.class_2.remain_seat),
            "class3": Number(train.class_in_train.class_3.remain_seat)
        }
        for(let i in exitTicket){
            if(Number(exitTicket[i].reservation_class) == 1){
                remain.class1 -= Number(exitTicket[i].passenger)
            }else if(Number(exitTicket[i].reservation_class) == 2){
                remain.class2 -= Number(exitTicket[i].passenger)
            }else if(Number(exitTicket[i].reservation_class) == 3){
                remain.class3 -= Number(exitTicket[i].passenger)
            }
                
        }
        // console.log(remain)

        return {
            "class1": remain.class1,
            "class2": remain.class2,
            "class3": remain.class3
        }
    }

}

module.exports = Train
