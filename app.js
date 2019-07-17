const mainKey='XXXXXXXXXXXXXX'
const Base1='XXXXXXXXXXXXXX'
const UserBase='XXXXXXXXXXXXXX'

const express=require('express')
const Airtable = require('airtable');
const jwt=require('jsonwebtoken')
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require("ejs");
const fetch=require('node-fetch')
const fs=require('fs')
// const bodyParser = requireeeee('body-parser');
const {initPayment, responsePayment} = require("./paytm/services/index");//paytm

var app=express()

// require("dotenv").config();
app.use(cors());//paytm

app.use(bodyParser.json());//paytm
app.use(bodyParser.urlencoded({extended: true}));//paytm

app.use(express.static('public'))
app.use(express.json())

app.set("view engine", "ejs");//paytm

var upstr=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <link rel="stylesheet" href="./main.css">
    <style>
        body{
    background: black;
    color: #f17b12;
    font-family: sans-serif;
}

.container{
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 20px;
}

.text{
    display: flex;
    margin-bottom: 15px;
}

.container img{
    height: 50px;
    margin-left: 50px;
    margin-bottom: 50px;
}

i{
    font-size: 100px;
}

a{
    width: 100%;
    text-decoration: none;
    color: white;
    background: #f17b12;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 15px;
    margin-left: 50px;
}

.text p{
    margin-left: 20px;
    margin-top: 0px;
    width: 350px;
}

@media (max-width: 575.98px){
    .container{
        padding: 30px;
        font-size: 17px;
    }

    .text p{
        width: 200px;
    }
}
    </style>
    <title>PUBG ZONE</title>

</head>
<body>

    <div class="container">
            <img src="../../images/nav.png" alt="can't load image">

            <div class="text">
            `
var upstr2=upstr+`<i class="far fa-check-circle"></i>  <p> <span style="font-size:60px;">Sucess</span><br>`
upstr+=`<i class="fas fa-exclamation"></i>  <p>`
var downstr=`</p>
        </div>
        <a href="../../">
            Go Back
        </a>
    </div>

</body>
</html>`

var downstr2=`</p>
        </div>
        <a href="../../profile/wallet">
            Go To Wallet
        </a>
    </div>

</body>
</html>`
//paytm
app.get("/paywithpaytm", (req, res) => {
    initPayment(req.query.amount).then(
        success => {
             jwt.verify(req.query.token, 'secretkey@', (err, authData) => {
                if(err) {res.send('<h1>Please Refresh</h1><a href="../"><a/>');return;}
                var email=authData.email
                var d1=new Date()
                d1=d1.getTime()
                var objstr='{"checksumhash":"'+success.ORDER_ID+'","email":"'+email+'","inittime":'+d1+'}'
                var obj=JSON.parse(objstr)
                savetofile(obj).then(()=>{
                        res.render("paytmRedirect.ejs", {
                    resultData: success,
                    paytmFinalUrl: "https://securegw.paytm.in/theia/processTransaction"
                    });
                })
                
             })
        },
        error => {
                  
                             
            res.send(error);
        }
    );
});

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(
        success => {

           if(success.STATUS=='TXN_SUCCESS'){ 
                       reademail(success.ORDERID).then((email)=>{
                           if(email)
                           {
                               
                               updateWallet(email,success.TXNAMOUNT).then(()=>{res.send(upstr2+'Transaction has occured successfully. Thank you for using pubg Zone'+downstr)}).catch(()=>{paymentfail(success.TXNAMOUNT,email);res.send('<h1>Pyment Faliur ! Dont worry Your Payment will be refunded within 24 hr 1</h1>')})
                               return;}
                           res.render("response.ejs", {resultData: "true", responseData: success});
                           }).catch(()=>{res.send(upstr+'Payment Faliure</h1>'+downstr)})}
                   else{
                    res.send(upstr+'Payment Faliure</h1>'+downstr)
                   }

        },
        error => {        
            res.send(error);
        }
    );
});
//patym

app.get('/api',(req,res)=>{

    Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: mainKey
});
var base = Airtable.base(Base1);
	base('Match1').select({
    // Selecting the first 3 records in Grid view:
    
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    var str='[';
    records.forEach(function(record) {
        var Matchname=record.get('Matchname');
        var time=record.get('time');
        var Win=record.get('Win');
        var Perkill=record.get('Perkill');
        var entryfee=record.get('entryfee');
        var type=record.get('type');
        var version=record.get('version');
        var join=record.get('Joining');
        var totaluser=record.get('totaluser')
        var matchId=record.get('matchId')
        var ongoing=record.get('Ongoing')
        // console.log(Matchname,time,Win,Perkill,entryfee,type,version)
        str+=`{
        	"Matchname":"${Matchname}",
        	"Time": "${time}",
        	"Win": "${Win}",
        	"Perkill": "${Perkill}",
        	"entryfee": "${entryfee}",
        	"type": "${type}" ,
        	"version":"${version}",
            "join":"${join}",
            "totaluser":"${totaluser}",
            "matchId":"${matchId}",
            "ongoing":"${ongoing}"
        },`
        
    });
    str=str.substring(0,str.length-1)
    str+=']'
    res.send(str)
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { 
    	// console.error(err); return; 
    	res.send('err')
    }
});
})

app.post('/api/signup',(req,res)=>{
    var data=req.body
    var username=data.name
    var password=data.password
    var email=data.email
    var phoneno=data.phone
    var paytm=data.paytm
    if(username||password||email||phoneno||paytm){
        fetchuser().then((emails)=>{
            if(emails.find((element)=>{return element==email})){
                res.json({alert:"Email already exist ",error:true})
            }
            else{
                var Airtable = require('airtable');
                var base = new Airtable({apiKey: mainKey}).base(UserBase);
                base('userdata').create({
                  "Name": `${username}`,
                  "Phone": `${phoneno}`,
                  "Paytm no.": `${phoneno}`,
                  "email": `${email}`,
                  "password": `${password}`,
                  "Paytm no.": `${paytm}`,
                  "Device id": "",
                  "Device Name": "",
                  "Wallet": "0",
                  "matchjoined":"[]",
                  "redeemed":"0"
                }, function(err, record) {
                    if (err) { console.error(err); res.json({alert:"can't register!",error:true}); return; }
                    res.json({msg:'sucessfull registered',error:'none'})
                });
            }
        }).catch(()=>{res.json({alert:"can't connect to server right now",error:true})})
    }
    else
    {
        res.json({alert:'please fill all the fileds'})
    }
})

app.post('/api/login',(req,res)=>{
   
    var data=req.body
    var email=data.email
    var password=data.password
    if(email && password){
    fetchuser().then((users)=>{
        var pos=users.findIndex((element)=>{return element==email})
        fetchpass().then((passes)=>{
            if(passes[pos]==password){
                // res.json({error:'none',msg:'email and password match'})
                createNewToken(email).then((tokenn)=>{
                    res.json({msg:'sucessfully logined',token:tokenn,error:'none'})
                }).catch(()=>{
                    res.json({error:true,alert:'can not connect to server'})
                })
            }else{
                res.json({error:true,alert:'email and password doest not match'})
            }
        })
        .catch((error)=>{res.json({error:true,alert:"can't connet to server pass"})})
    }).catch((error)=>{res.json({error:true,alert:"can't connet to server "})})
    }
    else{
        res.json({error:true,alert:"please refill the fields"})
    }
})

app.get('/api/wallet',(req,res)=>{
    req.token=req.query.token
     jwt.verify(req.token, 'secretkey@', (err, authData) => {
    if(err) {
        if(err.message=='jwt expired'){
            const payload = jwt.verify(req.token, 'secretkey@', {ignoreExpiration: true} );
            createNewToken(payload.email).then((token)=>{
                res.json({expired:true,refresh:true,refreshed:token})
            }).catch(()=>{
                res.json({refresh:false,logout:true})
            })
        }
        else{
              res.json({refresh:false,logout:true})
        }
    } else {
        fetchwallet(req.query.token).then((resp)=>{
                  res.json({
                wallet:resp,
                noerror:true
              });
        }).catch((error)=>{res.json({error:true,msg:"can't fetch here"})})
    }
})
})
const port=process.env.PORT || 3000

app.get('/api/joinme',(req,res)=>{
   var token=req.query.token
   var matchId=req.query.matchId
   var joined=null
   var total=null
   jwt.verify(token, 'secretkey@', (err, authData) => {
   if(err){
    res.send(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr);
    return;
    }
    fetch('http://localhost:'+port+'/api').then((res2)=>{res2.json().then((data)=>{
        data.forEach((match)=>{
            if(match.matchId==matchId){
                joined=match.join
                total=match.totaluser
            }
        })
       
        if(Number(joined)<Number(total)){
            var email=authData.email
               matchJoined(email).then((match)=>{
        if(JSON.parse(match).find((no)=>no==matchId)){
            res.send(upstr+`You already joined this match.<br> Please wait for the match to be completed on the given date and time. Or Try Joining other match.`+downstr)
        }else{
            
                fetchwallet(token).then((money)=>{
                    var flag=false
                    var flagfee=''
                   fetch('http://localhost:'+port+'/api').then((res2)=>{res2.json().then((data)=>{
                    data.forEach((element)=>{
                        if(element.matchId==matchId){
                            flag=true
                            flagfee=element.entryfee
                        }
                    })
                    if(flag){
                        getrecordidsquad(matchId).then((matchrecordid)=>{
                                joinandcut(matchId,flagfee,email,joined,matchrecordid).then((msg)=>{
                            res.send(msg)
                        }).catch(()=>{res.send(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr)})
                        }).catch(()=>{res.send(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr)})        
                    }
                }).catch(()=>{res.send(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr); })}).catch(()=>{})}).catch(()=>{
                 res.send(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr);   
                })
                // res.send('</h1>wait we are joining you</h1>')
        }
   }).catch((err)=>{
   
    res.send(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr);
   })
        }else{
           res.send(upstr+'Please Join another match . This match is full'+downstr);
        }
    })})
})
})

app.get('/api/redeem',(req,res)=>{
        var token=req.query.token
        var amount=req.query.amount
        if(token && amount){jwt.verify(token, 'secretkey@', (err, authData) => {
    if(err) {res.send(upstr+"Can't redeem ! Please try again . It may be due to some server error or network error"+downstr);return}
        var email=authData.email
        getrecordid(email).then((recordid)=>{
            fetchwalletwithemail(email).then((moneyinwallet)=>{
                fetchredeemwithemail(email).then((redeeminwallet)=>{
                        //updating
                        if(moneyinwallet>=amount){var Airtable = require('airtable');
                                                var base = new Airtable({apiKey: mainKey}).base(UserBase);
                        
                                                base('userdata').update(recordid, {
                                                  "Wallet": String(Number(moneyinwallet)-Number(amount)),
                                                  "redeemed":String(Number(redeeminwallet)+Number(amount))
                                                }, function(err, record) {
                                                  if (err) { console.error(err);res.send(upstr+"Can't redeem ! Please try again . It may be due to some server error or newtwork errorrr"+downstr); return; }
                                                  res.send(upstr2+'Sucessfully Reedemed ! Your Payment will be transfered to your paytm account within 24 hours'+downstr2)
                                                });}else{
                                                    res.send(upstr+'Money in your wallet is less than the amount you want to redeem'+downstr)
                                                }
                        //
                }).catch(()=>{res.send(upstr+"Can't redeem ! Please try again . It may be due to some server error or network error"+downstr)})
            }).catch(()=>{res.send(upstr+"Can't redeem ! Please try again . It may be due to some server error or network error"+downstr)})
        }).catch(()=>{res.send(upstr+"Can't redeem ! Please try again . It may be due to some server error or network error"+downstr)})

})}else{
          res.send(upstr+"Can't redeem ! Please try again . It may be due to some server error or network error "+downstr)  
        }
})
app.get('/api/givemeusername',(req,res)=>{
    token=req.query.token
    jwt.verify(token, 'secretkey@', (err, authData) => {
        var email=authData.email
        fetchnamewithemail(email).then((name)=>{
            res.json({noerror:true,name:name})
        })
    })

})

app.get('/api/roomdetails',(req,res)=>{
    token=req.query.token
    jwt.verify(token, 'secretkey@', (err, authData) => {
        if(err){res.json({error:true,msg:'unable to fetch'});return;}
        var details=[]
        var email=authData.email
        fetchmatchjoinedwithemail(email).then((matchjoinedarray)=>{
            //fetching match
                var Airtable = require('airtable');
                var base = new Airtable({apiKey: mainKey}).base(Base1);

                base('Match1').select({
                    view: "Grid view"
                }).eachPage(function page(records, fetchNextPage) {
                    // This function (`page`) will get called for each page of records.

                    records.forEach(function(record) {
                         details.push({matchname:record.get('Matchname'),id:record.get('matchId'),roomid:record.get('room_username'),roompass:record.get('room_password')})
                    });

                    // To fetch the next page of records, call `fetchNextPage`.
                    // If there are more records, `page` will get called again.
                    // If there are no more records, `done` will get called.
                    fetchNextPage();

                }, function done(err) {
                    if (err) { res.json({error:true,msg:'unable to fetch'}); return; }
                    var resp=[]
                        JSON.parse(matchjoinedarray).forEach((matchid)=>{
                        details.forEach((match)=>{
                            if(match.id==matchid){
                                resp.push(match)
                            }
                        })
                    })
                    if(!resp.length){
                        res.json({error:true,msg:'Please first join a match'})
                    }else{
                    res.json(resp)
                }
                });
            //
        }).catch(()=>{res.json({error:true,msg:'unable to fetch'})})
    })
})

app.get('/api/updateuser',(req,res)=>{
    var username=req.query.username
    var phone=req.query.phone
    var paytm=req.query.paytm
    var token=req.query.token
    if(username && phone && paytm ){
         jwt.verify(token, 'secretkey@', (err, authData) => {
        if(err){res.send(upstr+'Some Problem occured ! Please Try Again'+downstr);return;}
        var email=authData.email
        getrecordid(email).then((recordid)=>{
            var Airtable = require('airtable');
            var base = new Airtable({apiKey: mainKey}).base(UserBase);

            base('userdata').update(recordid, {
              "Name": username,
              "Phone": phone,
              "Paytm no.": paytm,
            }, function(err, record) {
              if (err) {res.send(upstr+'Some Problem occured ! Please Try Again'+downstr); return; }
              res.send(upstr2+'User Info Updated sucessfully '+downstr)
            });
        }).catch(()=>{res.send(upstr+'Some Problem occured ! Please Try Again'+downstr)})

    })
        
    }else{
        res.send(upstr+'Some Problem occured ! Please Try Again'+downstr)
    }

})

app.get('/api/userdetails',(req,res)=>{
    var token=req.query.token
    if(token){
        jwt.verify(token, 'secretkey@', (err, authData) => {
        if(err){res.json({error:true,msg:'Something went Wrong'});return;}
        var email=authData.email
        getrecordid(email).then((recordid)=>{
            var Airtable = require('airtable');
            var base = new Airtable({apiKey: mainKey}).base(UserBase);

            base('userdata').find(recordid, function(err, record) {
                if (err) { res.json({error:true,msg:'Something went Wrong'}); return; }
                res.json({username:record.get('Name'),phone:record.get('Phone'),paytm:record.get('Paytm no.'),noerror:true});
            });
        }).catch(()=>{res.json({error:true,msg:'Something went Wrong'})})
    })
    }else{
        res.json({error:true,msg:'Something went Wrong'})
    }
})

app.listen(port,()=>{
	console.log('server started at port '+port)
})

function fetchuser(){
return new Promise((resolve,reject)=>{
var users=[]
var rec=[]
var Airtable = require('airtable');
var base = new Airtable({apiKey: mainKey}).base(UserBase);
base('userdata').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    rec.push(records)
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((user)=>{
            users.push(user.get('email'))
        })
    })
    resolve(users)
});
})
}
function fetchpass(){
return new Promise((resolve,reject)=>{
var passwords=[]
var rec=[]
var Airtable = require('airtable');
var base = new Airtable({apiKey: mainKey}).base(UserBase);
base('userdata').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    rec.push(records)
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((pass)=>{
            passwords.push(pass.get('password'))
        })
    })
    resolve(passwords)
});
})
}

function  createNewToken(email){
    return new Promise((resolve,reject)=>{
 var user={email:email}
jwt.sign(user, 'secretkey@', { expiresIn: '4h' }, (err, token) => {
    resolve(token)
  });
    })
}

function fetchallwallet(){
    return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(UserBase);
        var wallets=[]
        var rec=[]
        base('userdata').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.get('Wallet'))
        })
    })
    resolve(wallets)
        });
 })   
}

function fetchwallet(token){
    return new Promise((resolve,reject)=>{
      jwt.verify(token, 'secretkey@', (err, authData) => {
        if(!err){var email=authData.email
                 fetchuser().then((users)=>{
                var pos=users.findIndex((element)=>{return element==email})
                fetchallwallet()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })}
                 else{
                    reject('cant verify')
                 }
})
      })
}

function matchJoined(email){
return new Promise((resolve,reject)=>{
fetchuser().then((users)=>{
        var pos=users.findIndex((element)=>{return element==email})
        fetchallmatch().then((matches)=>{
            resolve(matches[pos])
        }).catch(()=>{reject('cantt fetch')})
    }).catch(()=>{reject('cant fetch')})
})
}

function fetchallmatch(){
    return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(UserBase);
        var wallets=[]
        var rec=[]
        base('userdata').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.get('matchjoined'))
        })
    })
    resolve(wallets)
        });
 })   
}

function fetchallnames(){
     return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(UserBase);
        var wallets=[]
        var rec=[]
        base('userdata').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.get('Name'))
        })
    })
    resolve(wallets)
        });
 })
}

function fetchallredeem(){
    return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(UserBase);
        var wallets=[]
        var rec=[]
        base('userdata').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.get('redeemed'))
        })
    })
    resolve(wallets)
        });
 })   
}

function fetchallmatchjoined(){
return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(UserBase);
        var wallets=[]
        var rec=[]
        base('userdata').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.get('matchjoined'))
        })
    })
    resolve(wallets)
        });
 })   
}
function joinandcut(matchidtoaddd,feetocut,email,joined,matchrecordid){
 
 return new Promise((resolve,reject)=>{
    matchJoined(email).then((matchjoined)=>{
        fetchwalletwithemail(email).then((moneyinwallet)=>{
            
                if(Number(moneyinwallet)<Number(feetocut)){
                    resolve(upstr+'Did not have sufficient balance in wallet'+downstr2)
                }else{
                    
                    getrecordid(email).then((recordid)=>{
                    if(matchjoined=='[]'){
                    //
                    var Airtable = require('airtable');
                    var base = new Airtable({apiKey: mainKey}).base(UserBase);
                        base('userdata').update(recordid, {
                      "matchjoined": "["+matchidtoaddd+"]",
                     
                      "Wallet": String(Number(moneyinwallet)-Number(feetocut)),
                  
                    }, function(err, record) {
                      if (err) { console.error(err); resolve(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr);return; }
                      //update no of user joined
                      var Airtable = require('airtable');
                        var base = new Airtable({apiKey: mainKey}).base(Base1);

                        base('Match1').update(matchrecordid, {
                         
                          "Joining": String(Number(joined)+1)
                        }, function(err, record) {
                          if (err) { console.error(err); return; }
                          
                        });
                      fetchnamewithemail(email).then((usernamee)=>{
                        resolve(upstr2+'Match Added sucessfully ! Make Sure Your UserName is  <i style="color:white; font-size:17px;">'+usernamee+'</i> We will identify you by this name,if Not Change '+downstr)
                      }).catch(()=>{ resolve(upstr2+'Match Added sucessfully ! Thank You for using pubg Zone'+downstr)})
                    });
                }else{
                    
                    var matchstr=matchjoined.slice(1,matchjoined.length-1)
                    //
                    var Airtable = require('airtable');
                    var base = new Airtable({apiKey: mainKey}).base(UserBase);
                   
                    base('userdata').update(recordid, {
                      "matchjoined": "["+matchstr+","+matchidtoaddd+"]",
                      // "email": "priyanshvatsal@gmail.com",
                      // "Name": "priyansh",
                      // "password": "8864995682",
                      // "Phone": "8864995682",
                      "Wallet":String(Number(moneyinwallet)-Number(feetocut)),
                      // "Paytm no.": "8864995682"
                    }, function(err, record) {
                      if (err) {  resolve(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr);return; }
                     fetchnamewithemail(email).then((usernamee)=>{
                        resolve(upstr2+'Match Added sucessfully ! Make Sure Your UserName is  <i style="color:white; font-size:17px;">'+usernamee+'</i> We will identify you by this name,if Not Change '+downstr)
                      }).catch(()=>{ resolve(upstr2+'Match Added sucessfully ! Thank You for using pubg Zone'+downstr)})
                    
                    });
                    //

                }
                }).catch(()=>{resolve(upstr+'Please Join Again ! It may be due to server internal error or network connection.'+downstr)})
                }
        }).catch(()=>{reject('cant fetch')})
    }).catch(()=>{reject('cant fetch')})
 })  
}
function fetchwalletwithemail(email){
    return new Promise((resolve,reject)=>{
                 fetchuser().then((users)=>{
                var pos=users.findIndex((element)=>{return element==email})
                fetchallwallet()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })
      })
}

function fetchredeemwithemail(email){
    return new Promise((resolve,reject)=>{
                 fetchuser().then((users)=>{
                var pos=users.findIndex((element)=>{return element==email})
                fetchallredeem()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })
      })
}
function fetchnamewithemail(email){
        return new Promise((resolve,reject)=>{
                 fetchuser().then((users)=>{
                var pos=users.findIndex((element)=>{return element==email})
                fetchallnames()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })
      })
}

function fetchmatchjoinedwithemail(email){
return new Promise((resolve,reject)=>{
                 fetchuser().then((users)=>{
                var pos=users.findIndex((element)=>{return element==email})
                fetchallmatchjoined()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })
      })
}
function fetchjoined(matchid){

}
function savetofile(objtostored){
return new Promise((resolve,reject)=>{
    fs.readFile('paytmqueue.txt','utf8',(err,data)=>{
        if(err){reject()}
        var pastobj=JSON.parse(data)
            //
            var itemdel=[]
            pastobj.forEach((eachobj,index)=>{
            var s=Math.ceil((((new Date()).getTime())-eachobj.inittime)/1000)
            if(s>2000){
            itemdel.push(index)
            }
            })
            itemdel.forEach((element)=>{
            pastobj.splice(element,1)
            })
            //
        pastobj.push(objtostored)
        fs.writeFile('paytmqueue.txt',JSON.stringify(pastobj),(err,data)=>{
            if(err){reject()}
            resolve('filesaved')
        })
    })
})
}

function reademail(checksumhash){
    return new Promise((resolve,reject)=>{
   fs.readFile('paytmqueue.txt','utf8',(err,data)=>{
    if(err){reject();return;}
    var obj=JSON.parse(data)
    var email=null
    obj.forEach((element)=>{
        if(element.checksumhash==checksumhash){
            email=element.email
        }
    })
   
    resolve(email)
   }) 
   })
}


function updateWallet(email,amountaded){
    return new Promise((resolve,reject)=>{
          fetchwalletwithemail(email).then((moneyinwallet)=>{
            getrecordid(email).then((recordid)=>{
                var Airtable = require('airtable');
                    var base = new Airtable({apiKey: mainKey}).base(UserBase);
                        base('userdata').update(recordid, {
                      // "matchjoined": "["+matchidtoaddd+"]",
                      // "email": "priyanshvatsal@gmail.com",
                      // "Name": "priyansh",
                      // "password": "8864995682",
                      // "Phone": "8864995682",
                      "Wallet": String(Number(moneyinwallet)+Number(amountaded)),
                      // "Paytm no.": "8864995682"
                    }, function(err, record) {
                      if (err) {  reject();return; }
                      resolve()
                      
                    });
            }).catch((error)=>{})          
          }).catch((error)=>{})
        })
}
function getrecordid(email){
    return new Promise((resolve,reject)=>{
                 fetchuser().then((users)=>{
                var pos=users.findIndex((element)=>{return element==email})
                fetchallid()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })
      })
}
function getrecordidsquad(recordId){
    return new Promise((resolve,reject)=>{
                 fetchmatchid().then((users)=>{
                var pos=users.findIndex((element)=>{return element==recordId})
                fetchallidsquad()
        .then((res)=>{
          resolve(res[pos])
        })
        .catch((Error)=>{reject('cant fetch')})
              })
      })
}
function fetchmatchid(){
    return new Promise((resolve,reject)=>{
        var ar=[]
      fetch('http://localhost:'+port+'/api').then((res2)=>{res2.json().then((data)=>{
        data.forEach((match)=>{
            ar.push(match.matchId)
        });resolve(ar);}).catch(()=>{reject()})}).catch(()=>{reject()})
             
    })
}

function fetchallid(){
    return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(UserBase);
        var wallets=[]
        var rec=[]
        base('userdata').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.id)
        })
    })
    resolve(wallets)
        });
 })   
}
function fetchallidsquad(){
 return new Promise((resolve,reject)=>{
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: mainKey}).base(Base1);
        var wallets=[]
        var rec=[]
        base('Match1').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            rec.push(records)
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject("can't fetch");return; }
    rec.forEach((page)=>{
        page.forEach((wallet)=>{
            wallets.push(wallet.id)
        })
    })
    resolve(wallets)
        });
 })      
}
function paymentfail(amount,email){
    fs.readFile('paymentfaliur.txt','utf8',(err,data)=>{
        var dataobj=JSON.parse(data)
        var fg={email:email,amout:amount}
        dataobj.push(fg)
        fs.writeFile('paymentfaliur.txt',JSON.stringify(dataobj))
    })
}