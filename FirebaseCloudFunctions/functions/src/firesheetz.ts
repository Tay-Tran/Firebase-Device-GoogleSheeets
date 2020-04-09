// Copyright 2017 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///----------------------------------------------
//import * as moment from 'moment-timezone' ////https://momentjs.com/timezone/docs/
//var moment = require('moment-timezone');
//moment.tz.setDefault("Asia/Ho_Chi_Minh");

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'
import * as _ from 'lodash'
import { google} from 'googleapis'
import { kgsearch } from 'googleapis/build/src/apis/kgsearch';
import { isNumber } from 'util';
//moment.tz.setDefault("Asia/Ho_Chi_Minh");
//var nodemailer = require('nodemailer');
const sheets = google.sheets('v4')
const spreadsheetId = '1PpV0iEC1X3K-VirM8E8aBMKZcFAvCMDmniSCBSy3x9U'
let serviceAccount = require('../serviceAccount.json')
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const jwtClient = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],  // read and write sheets
})
const jwtAuthPromise = jwtClient.authorize()
//let set = {key:"1"};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dieukhienfirebase.firebaseio.com"
  });
// tao mail gui


  //
function wait(ms) {
    return new Promise(r => setTimeout(r, ms))  
 }

 export const automatic = functions.database.ref('/arduino1/test').onUpdate(async change => {
    await jwtAuthPromise ;  
    var h_t = JSON.parse(change.after.val()) ;
    const option = {
        service: 'gmail',
        auth: {
            user: 'internet.of.things.server@gmail.com', // email hoặc username
            pass: 'tay************@' // password
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    var transporter, mail;
    var auto = admin.database().ref("/arduino1/cai_dat/automatic").once('value').then(function(snapshot) {
        if((h_t.humidity > snapshot.val().humidity.max_h || h_t.humidity < snapshot.val().humidity.min_h) && (h_t.temperature > snapshot.val().temperature.max_t || h_t.temperature < snapshot.val().temperature.min_t)){
            transporter = nodemailer.createTransport(option);
       
            transporter.verify(function(err, success) {
        // Nếu có lỗi.
        if (err) {
            console.log(err);
        } else { //Nếu thành công.
            console.log('Kết nối thành công!');
             mail = {
                from: 'internet.of.things.server@gmail.com', // Địa chỉ email của người gửi
                to: snapshot.val().email.slice(1,snapshot.val().email.length - 1), // Địa chỉ email của người nhận
                subject: 'Thông Báo', // Tiêu đề mail
                text: 'Temperature = ' + h_t.temperature + ' đã nằm ngoài khoảng MIN = ' + snapshot.val().temperature.min_t + ', MAX = ' + snapshot.val().temperature.max_t + ' và\n' + 'Humidity = ' + h_t.humidity +' đã nằm ngoài khoảng MIN = ' + snapshot.val().humidity.min_h + ', MAX = ' + snapshot.val().humidity.max_h, // Nội dung mail dạng text
            };
            //Tiến hành gửi email
            transporter.sendMail(mail, function(error3, info) {
                if (error3) { // nếu có lỗi
                    console.log(error3);
                } else { //nếu thành công
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
        }else{
            if(h_t.humidity > snapshot.val().humidity.max_h || h_t.humidity < snapshot.val().humidity.min_h){
            
                transporter = nodemailer.createTransport(option);
       
               transporter.verify(function(error, success) {
           // Nếu có lỗi.
           if (error) {
               console.log(error);
           } else { //Nếu thành công.
               console.log('Kết nối thành công!');
                mail = {
                   from: 'internet.of.things.server@gmail.com', // Địa chỉ email của người gửi
                   to: snapshot.val().email.slice(1,snapshot.val().email.length - 1), // Địa chỉ email của người nhận
                   subject: 'Thông Báo', // Tiêu đề mail
                   text: 'Humidity = ' + h_t.humidity +' đã nằm ngoài khoảng MIN = ' + snapshot.val().humidity.min_h + ', MAX = ' + snapshot.val().humidity.max_h, // Nội dung mail dạng text
               };
               //Tiến hành gửi email
               transporter.sendMail(mail, function(error1, info) {
                   if (error1) { // nếu có lỗi
                       console.log(error1);
                   } else { //nếu thành công
                       console.log('Email sent: ' + info.response);
                   }
               });
           }
       });
           }else{
               if(h_t.temperature > snapshot.val().temperature.max_t || h_t.temperature < snapshot.val().temperature.min_t){
                   transporter = nodemailer.createTransport(option);
       
               transporter.verify(function(erro, success) {
           // Nếu có lỗi.
           if (erro) {
               console.log(erro);
           } else { //Nếu thành công.
               console.log('Kết nối thành công!');
                mail = {
                   from: 'internet.of.things.server@gmail.com', // Địa chỉ email của người gửi
                   to: snapshot.val().email.slice(1,snapshot.val().email.length - 1), // Địa chỉ email của người nhận
                   subject: 'Thông Báo', // Tiêu đề mail
                   text: 'Temperature = ' + h_t.temperature + ' đã nằm ngoài khoảng MIN = ' + snapshot.val().temperature.min_t + ', MAX = ' + snapshot.val().temperature.max_t, // Nội dung mail dạng text
               };
               //Tiến hành gửi email
               transporter.sendMail(mail, function(error2, info) {
                   if (error2) { // nếu có lỗi
                       console.log(error2);
                   } else { //nếu thành công
                       console.log('Email sent: ' + info.response);
                   }
               });
           }
       });
               }
           }
        }
        //    console.log(snapshot.val());
         //   var username = snapshot.val() || 'Anonymous';
            //// ...
          });
    //
    
    })

 
 export const data_arduino1 = functions.database.ref('/arduino1/test').onUpdate(async change => {
    await jwtAuthPromise ;  
    var h_t = JSON.parse(change.after.val()) ;
    //console.log(aa);
    //console.log(aa.humidity);
    //var db = admin.database();
    //admin.database().ref("/arduino1/cai_dat/timer").once("value", function(snapshot) {
     //   console.log(snapshot.val());
    //    return snapshot.val();
    //});
    //return admin.database().ref("/arduino1/test").set({
     //   username: change.after.val().lan1.gia_tri1
        
     // });
     //var adf = "username";
     var bbb = admin.database().ref("/arduino1/gia_tri").update({do_am1:{gia_tri:h_t.humidity},nhiet_do1:{gia_tri:h_t.temperature}});
     var cc,phut,gio,ngay,thang;
     
     var date_fb = new Date();
     var date = new Date(date_fb.getFullYear(), date_fb.getMonth(), date_fb.getDate(), date_fb.getHours() + 7, date_fb.getMinutes());
     var thoigian = Number((date.getHours() + date.getMinutes()/60).toFixed(3));
     if(date.getMinutes()<10){
         phut = "0" + date.getMinutes();
     }else{
        phut = date.getMinutes();
     }
     if(date.getHours()<10){
         gio = "0" + date.getHours() ;
     }else{
         gio = date.getHours() ;
     }
     if(date.getDate()<10){
         ngay = "0" + date.getDate();
     }else{
         ngay = date.getDate();
     }
     if(date.getMonth()<10){
        thang = "0" + date.getMonth();
     }else{
         thang = date.getMonth();
     }
     var date_month_year = ngay + "" + thang + "" + date.getFullYear();
     var dd = admin.database().ref("/arduino1/do_thi/" + date_month_year).once('value').then(function(snapshot) {       
        console.log(snapshot.val());
        
        if(snapshot.val() !== null){
            var i = 1;
            for(var x in snapshot.val()){
            i=i+1;
            }
            var so_lan = 1000 + i;
             cc = admin.database().ref("/arduino1/do_thi/"+date_month_year + "/" + so_lan).update({do_am: h_t.humidity,nhiet_do: h_t.temperature,thoi_gian: thoigian});
        }else{
             cc = admin.database().ref("/arduino1/do_thi/" + date_month_year + "/1001").update({do_am: h_t.humidity,nhiet_do: h_t.temperature,thoi_gian: thoigian});
        }  
        
      });
      
      //var aa = admin.database().ref("/arduino1/test").set({username: change.after.val().lan1.gia_tri1});
     // var bb = admin.database().ref("/arduino1/test1").set({username1: change.after.val().lan1.gia_tri1});
      return 0;
    })
 export const arduino1 = functions.database.ref('/arduino1/cai_dat/timer').onUpdate(async change => {
    await jwtAuthPromise ;
    
    //var db = admin.database();
    //admin.database().ref("/arduino1/cai_dat/timer").once("value", function(snapshot) {
     //   console.log(snapshot.val());
    //    return snapshot.val();
    //});
   // return admin.database().ref("/arduino1/test").set({
     //   username: "tay"
        
     // });
    // return admin.database().ref("/arduino1/cai_dat/timer").once('value').then(function(snapshot) {
    //    console.log(snapshot.val());
     //   var username = snapshot.val() || 'Anonymous';
        //// ...
     // });

        if(change.before.val().lan1.gia_tri1 != change.after.val().lan1.gia_tri1){
            //let l = ;
            if (Number(change.after.val().lan1.gia_tri1.slice(1, 2)) === 1 || Number(change.after.val().lan1.gia_tri1.slice(1, 2)) === 2 || Number(change.after.val().lan1.gia_tri1.slice(1, 2)) === 3)
            {               
                sheets.spreadsheets.values.update({
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: 'key!B2:E2',  
                    valueInputOption: 'RAW',
                    requestBody: { values: [["" + change.after.val().lan1.gia_tri1.slice(1, 6), "" + change.after.val().lan1.gia_tri1.slice(6, 18), "" + change.after.val().lan1.gia_tri1.slice(18, 30), "" + change.after.val().lan1.gia_tri1.slice(30, change.after.val().lan1.gia_tri1.length - 1).replace("\\", "")]]}
                }, {})
               // return 0;           
            }else{
                if(change.after.val().lan1.gia_tri1 == "\"0\""){
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B2:E2',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["0", "0", "0", "0"]]}
                    }, {})
                }else{
                    if(change.after.val().lan1.gia_tri1.length > 32){
                        sheets.spreadsheets.values.update({
                            auth: jwtClient,
                            spreadsheetId: spreadsheetId,
                            range: 'key!B2:E2',  
                            valueInputOption: 'RAW',
                            requestBody: { values: [["0" + change.after.val().lan1.gia_tri1.slice(2, 6), "" + change.after.val().lan1.gia_tri1.slice(6, 18), "" + change.after.val().lan1.gia_tri1.slice(18, 30), "" + change.after.val().lan1.gia_tri1.slice(30, change.after.val().lan1.gia_tri1.length - 1).replace("\\", "")]]}
                        }, {})

                    }
                }
            }
        }else{
            if(change.before.val().lan2.gia_tri2 != change.after.val().lan2.gia_tri2){
              
                if (Number(change.after.val().lan2.gia_tri2.slice(1, 2)) === 1 || Number(change.after.val().lan2.gia_tri2.slice(1, 2)) === 2 || Number(change.after.val().lan2.gia_tri2.slice(1, 2)) === 3)
                {
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!F2:I2',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["" + change.after.val().lan2.gia_tri2.slice(1, 6), "" + change.after.val().lan2.gia_tri2.slice(6, 18), "" + change.after.val().lan2.gia_tri2.slice(18, 30), "" + change.after.val().lan2.gia_tri2.slice(30, change.after.val().lan2.gia_tri2.length - 1).replace("\\", "")]]}
                    }, {})           
                }else{
                if(change.after.val().lan2.gia_tri2 == "\"0\""){
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!F2:I2',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["0", "0", "0", "0"]]}
                    }, {})
                }else{
                    if(change.after.val().lan2.gia_tri2.length > 32){
                        sheets.spreadsheets.values.update({
                            auth: jwtClient,
                            spreadsheetId: spreadsheetId,
                            range: 'key!F2:I2',  
                            valueInputOption: 'RAW',
                            requestBody: { values: [["0" + change.after.val().lan2.gia_tri2.slice(2, 6), "" + change.after.val().lan2.gia_tri2.slice(6, 18), "" + change.after.val().lan2.gia_tri2.slice(18, 30), "" + change.after.val().lan2.gia_tri2.slice(30, change.after.val().lan2.gia_tri2.length - 1).replace("\\", "")]]}
                        }, {})    
                    }
                }
            }
            }else{
                if(change.before.val().lan3.gia_tri3 != change.after.val().lan3.gia_tri3){
                    //let l = ;
                    if (Number(change.after.val().lan3.gia_tri3.slice(1, 2)) === 1 || Number(change.after.val().lan3.gia_tri3.slice(1, 2)) === 2 || Number(change.after.val().lan3.gia_tri3.slice(1, 2)) === 3)
                    {
                        sheets.spreadsheets.values.update({
                            auth: jwtClient,
                            spreadsheetId: spreadsheetId,
                            range: 'key!J2:M2',  
                            valueInputOption: 'RAW',
                            requestBody: { values: [["" + change.after.val().lan3.gia_tri3.slice(1, 6), "" + change.after.val().lan3.gia_tri3.slice(6, 18), "" + change.after.val().lan3.gia_tri3.slice(18, 30), "" + change.after.val().lan3.gia_tri3.slice(30, change.after.val().lan3.gia_tri3.length - 1).replace("\\", "")]]}
                        }, {})           
                    }else{
                        if(change.after.val().lan3.gia_tri3 == "\"0\""){
                            sheets.spreadsheets.values.update({
                                auth: jwtClient,
                                spreadsheetId: spreadsheetId,
                                range: 'key!J2:M2',  
                                valueInputOption: 'RAW',
                                requestBody: { values: [["0", "0", "0", "0"]]}
                            }, {})  
                        }else{
                            if(change.after.val().lan3.gia_tri3.length > 32){
                                sheets.spreadsheets.values.update({
                                    auth: jwtClient,
                                    spreadsheetId: spreadsheetId,
                                    range: 'key!J2:M2',  
                                    valueInputOption: 'RAW',
                                    requestBody: { values: [["0" + change.after.val().lan3.gia_tri3.slice(2, 6), "" + change.after.val().lan3.gia_tri3.slice(6, 18), "" + change.after.val().lan3.gia_tri3.slice(18, 30), "" + change.after.val().lan3.gia_tri3.slice(30, change.after.val().lan3.gia_tri3.length - 1).replace("\\", "")]]}
                                }, {}) 
                            }
                        }
                    }
                }else{
                    if(change.before.val().lan4.gia_tri4 != change.after.val().lan4.gia_tri4){
                        //let l = ;
                        if (Number(change.after.val().lan4.gia_tri4.slice(1, 2)) === 1 || Number(change.after.val().lan4.gia_tri4.slice(1, 2)) === 2 || Number(change.after.val().lan4.gia_tri4.slice(1, 2)) === 3)
                        {
                            sheets.spreadsheets.values.update({
                                auth: jwtClient,
                                spreadsheetId: spreadsheetId,
                                range: 'key!N2:Q2',  
                                valueInputOption: 'RAW',
                                requestBody: { values: [["" + change.after.val().lan4.gia_tri4.slice(1, 6), "" + change.after.val().lan4.gia_tri4.slice(6, 18), "" + change.after.val().lan4.gia_tri4.slice(18, 30), "" + change.after.val().lan4.gia_tri4.slice(30, change.after.val().lan4.gia_tri4.length - 1).replace("\\", "")]]}
                            }, {})           
                        }else{
                            if(change.after.val().lan4.gia_tri4 == "\"0\""){
                                sheets.spreadsheets.values.update({
                                    auth: jwtClient,
                                    spreadsheetId: spreadsheetId,
                                    range: 'key!N2:Q2',  
                                    valueInputOption: 'RAW',
                                    requestBody: { values: [["0", "0", "0", "0"]]}
                                }, {})  
                            }else{
                                if(change.after.val().lan4.gia_tri4.length > 32){
                                    sheets.spreadsheets.values.update({
                                        auth: jwtClient,
                                        spreadsheetId: spreadsheetId,
                                        range: 'key!N2:Q2',  
                                        valueInputOption: 'RAW',
                                        requestBody: { values: [["0" + change.after.val().lan4.gia_tri4.slice(2, 6), "" + change.after.val().lan4.gia_tri4.slice(6, 18), "" + change.after.val().lan4.gia_tri4.slice(18, 30), "" + change.after.val().lan4.gia_tri4.slice(30, change.after.val().lan4.gia_tri4.length - 1).replace("\\", "")]]}
                                    }, {}) 
                                }
                            }
                        }
                    }else{
                        if(change.before.val().lan5.gia_tri5 != change.after.val().lan5.gia_tri5){
                            //let l = ;
                            if (Number(change.after.val().lan5.gia_tri5.slice(1, 2)) === 1 || Number(change.after.val().lan5.gia_tri5.slice(1, 2)) === 2 || Number(change.after.val().lan5.gia_tri5.slice(1, 2)) === 3)
                            {
                                sheets.spreadsheets.values.update({
                                    auth: jwtClient,
                                    spreadsheetId: spreadsheetId,
                                    range: 'key!R2:V2',  
                                    valueInputOption: 'RAW',
                                    requestBody: { values: [["" + change.after.val().lan5.gia_tri5.slice(1, 6), "" + change.after.val().lan5.gia_tri5.slice(6, 18), "" + change.after.val().lan5.gia_tri5.slice(18, 30), "" + change.after.val().lan5.gia_tri5.slice(30, change.after.val().lan5.gia_tri5.length - 1).replace("\\", "")]]}
                                }, {})           
                            }else{
                                if(change.after.val().lan5.gia_tri5 == "\"0\""){
                                    sheets.spreadsheets.values.update({
                                        auth: jwtClient,
                                        spreadsheetId: spreadsheetId,
                                        range: 'key!R2:V2',  
                                        valueInputOption: 'RAW',
                                        requestBody: { values: [["0", "0", "0", "0"]]}
                                    }, {})  
                                }else{
                                    if(change.after.val().lan5.gia_tri5.length > 32){
                                        sheets.spreadsheets.values.update({
                                            auth: jwtClient,
                                            spreadsheetId: spreadsheetId,
                                            range: 'key!R2:V2',  
                                            valueInputOption: 'RAW',
                                            requestBody: { values: [["0" + change.after.val().lan5.gia_tri5.slice(2, 6), "" + change.after.val().lan5.gia_tri5.slice(6, 18), "" + change.after.val().lan5.gia_tri5.slice(18, 30), "" + change.after.val().lan5.gia_tri5.slice(30, change.after.val().lan5.gia_tri5.length - 1).replace("\\", "")]]}
                                        }, {})  
                                    }
                                }
                            }
                        }

                    }

                }

            }

        }                           
})

export const getTime = functions.database.ref('/arduino1/cai_dat/phun_suong/get').onUpdate(async change => {
   await jwtAuthPromise ;
    let key = "";
    key = change.after.val().gia_tri.slice(1,2);
    if(Number(key) === 1){
        let time_on = "", time_off = "";
        time_on = change.after.val().gia_tri.slice(2,14);
        time_off = change.after.val().gia_tri.slice(14,26);
        sheets.spreadsheets.values.update({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: 'key!B2:D2',  
            valueInputOption: 'RAW',
            requestBody: { values: [["1",time_on,time_off]]}
        }, {})
    }else{
        if(Number(key) === 0 && key != ""){
        // truyen key = 0 vao bang key
        //await jwtAuthPromise ;
        sheets.spreadsheets.values.update({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: 'key!B2',  
            valueInputOption: 'RAW',
            requestBody: { values: [["0"]]}
        }, {})
    }else{
        if(Number(key) === 2){
            await wait(2000);
            sheets.spreadsheets.values.update({
                auth: jwtClient,
                spreadsheetId: spreadsheetId,
                range: 'key!B2',  
                valueInputOption: 'RAW',
                requestBody: { values: [["2"]]}
            }, {})
         }
    }
    }
})

export const getDateLoop = functions.database.ref('/arduino1/cai_dat/phun_suong/date_loop').onUpdate(async change => {
    await jwtAuthPromise ;
     let key = "";
     key = change.after.val().gia_tri.slice(1,2);
     if(Number(key) === 1){
         let n ;
         n = (change.after.val().gia_tri.length - 3)/8;
         //n = Math.floor(n);
         //let n = parseInt(n1);//
            switch (n)
            {
                case 1 : {
                    let giatri = [];
                    let k=0
                    for(let i = 2; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B3:C3',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",giatri[0]]]}
                    }, {})
                    break;
                }
                case 2 : {
                    let giatri = [];
                    let k=0
                    for(let i = 2; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B3:D3',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",giatri[0],giatri[1]]]}
                    }, {})
                    break;
                }
                case 3 : {
                    let giatri = [];
                    let k=0
                    for(let i = 2; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B3:E3',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",giatri[0],giatri[1],giatri[2]]]}
                    }, {})
                    break;
                }
                case 4 : {
                    let giatri = [];
                    let k=0
                    for(let i = 2; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B3:F3',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",giatri[0],giatri[1],giatri[2],giatri[3]]]}
                    }, {})
                    break;
                }
                case 5 : {
                    let giatri = [];
                    let k=0
                    for(let i = 2; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B3:G3',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",giatri[0],giatri[1],giatri[2],giatri[3],giatri[4]]]}
                    }, {})
                    break;
                }
                default : {
                    console.log("loi o switch " +  '  ' + change.after.val().gia_tri.length + ' ' + change.after.val().gia_tri)
                    // do something
                }
            }
     }else{if(Number(key) === 0 && key != ""){
         // truyen key = 0 vao bang key
         //await jwtAuthPromise ;
         var a = sheets.spreadsheets.values.update({
             auth: jwtClient,
             spreadsheetId: spreadsheetId,
             range: 'key!B3',  
             valueInputOption: 'RAW',
             requestBody: { values: [["0"]]}
         }, {})
     }else{
         if(Number(key) === 2){
            await wait(2000);
            sheets.spreadsheets.values.update({
                auth: jwtClient,
                spreadsheetId: spreadsheetId,
                range: 'key!B3:G3',  
                valueInputOption: 'RAW',
                requestBody: { values: [["2","","","","",""]]}
            }, {})
         }
     }
     }
 })

 export const getWeekDayLoop = functions.database.ref('/arduino1/cai_dat/phun_suong/week_day_loop').onUpdate(async change => {
    await jwtAuthPromise ;
     let key = "";
     key = change.after.val().gia_tri.slice(1,2);
     if(Number(key) === 1){
         let n ;
         n = (change.after.val().gia_tri.length - 4)/8;
         //n = Math.floor(n);
         //let n = parseInt(n1);//
            switch (n)
            {
                case 1 : {
                    let giatri = [];
                    let k=0
                    for(let i = 3; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B4:D4',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",change.after.val().gia_tri.slice(2,3),giatri[0]]]}
                    }, {})
                    break;
                }
                case 2 : {
                    let giatri = [];
                    let k=0
                    for(let i = 3; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B4:E4',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",change.after.val().gia_tri.slice(2,3),giatri[0],giatri[1]]]}
                    }, {})
                    break;
                }
                case 3 : {
                    let giatri = [];
                    let k=0
                    for(let i = 3; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B4:F4',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",change.after.val().gia_tri.slice(2,3),giatri[0],giatri[1],giatri[2]]]}
                    }, {})
                    break;
                }
                case 4 : {
                    let giatri = [];
                    let k=0
                    for(let i = 3; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B4:G4',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",change.after.val().gia_tri.slice(2,3),giatri[0],giatri[1],giatri[2],giatri[3]]]}
                    }, {})
                    break;
                }
                case 5 : {
                    let giatri = [];
                    let k=0
                    for(let i = 3; i + 8 < change.after.val().gia_tri.length; i=i+8){                       
                        giatri[k] = change.after.val().gia_tri.slice(i,i+8);
                        k++;
                    }
                    sheets.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: 'key!B4:H4',  
                        valueInputOption: 'RAW',
                        requestBody: { values: [["1",change.after.val().gia_tri.slice(2,3),giatri[0],giatri[1],giatri[2],giatri[3],giatri[4]]]}
                    }, {})
                    break;
                }
                default : {
                    console.log("loi o switch " +  '  ' + change.after.val().gia_tri.length + ' ' + change.after.val().gia_tri)
                    // do something
                }
            }
     }else{if(Number(key) === 0 && key != ""){
         // truyen key = 0 vao bang key
         //await jwtAuthPromise ;
         var a = sheets.spreadsheets.values.update({
             auth: jwtClient,
             spreadsheetId: spreadsheetId,
             range: 'key!B4',  
             valueInputOption: 'RAW',
             requestBody: { values: [["0"]]}
         }, {})
     }else{
         if(Number(key) === 2){
            await wait(2000);
            sheets.spreadsheets.values.update({
                auth: jwtClient,
                spreadsheetId: spreadsheetId,
                range: 'key!B4:H4',  
                valueInputOption: 'RAW',
                requestBody: { values: [["2","","","","","",""]]}
            }, {})
         }
     }
     }
 })








 