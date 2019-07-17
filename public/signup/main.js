const form=document.getElementsByTagName('form')[0]
const name=document.getElementsByTagName('input')[0]
const phone=document.getElementsByTagName('input')[1]
const email=document.getElementsByTagName('input')[2]
const password=document.getElementsByTagName('input')[3]
const paytm=document.getElementsByTagName('input')[4]
const button=document.querySelector('.wait')
const submit=document.querySelector('.submit')

form.addEventListener('submit',(e)=>{
	e.preventDefault()
	name.value=name.value.trim()
	phone.value=phone.value.trim()
	email.value=email.value.trim()
	password.value=password.value.trim()
	paytm.value=paytm.value.trim()
	if(name.value=='')
	{
		alert('Please fill in name')
		return
	}	
	if(phone.value==''){
		alert('Please fill in phone')
		return
	}
	if(email.value==''){
		alert('Please fill in emil')
		return
	}
	if(password.value==''){
		alert('Please fill in password')
		return
	}
	if(paytm.value==''){
		alert('Please fill in paytm number')
		return
	}
	if(!validateEmail(email.value)){
		alert('please enter email correctly')
		return
	}
	if(!phonenumber(phone.value)){
		alert('please enter phone no correctly')
		return
	}
	if(password.value.length<5){
		alert('password too short')
		return
	}
	if(!phonenumber(paytm.value)){
		alert('please enter paytm phone no correctly')
		return
	}
	submit.style.display='none'
	button.style.display='block'
	var tosend=`{
		"name":"${name.value}",
		"email":"${email.value}",
		"phone":"${phone.value}",
		"password":"${password.value}",
		"paytm":"${paytm.value}"
	}`
	var xml=new XMLHttpRequest()
	xml.open('post','../api/signup',true)
	xml.setRequestHeader('Content-Type', 'application/json');
	xml.onload=function(){
		if(this.status==200){
			try{
			var data=JSON.parse(this.responseText)
			if(data.error==true && data.alert){
				alert(data.alert)
				submit.style.display='block'
				button.style.display='none'
				return
			}
			if(data.error=='none' && data.msg){
				// console.log('finally user created with no error')
				window.location.href='../login'

			}
			}
			catch(error){
			alert('Error in signup')
			submit.style.display='block'
			button.style.display='none'
		}
		}
		else{
			console.log('cannot connect to server ')
			submit.style.display='block'
			button.style.display='none'
		}
	}
	xml.send(tosend)
})

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function phonenumber(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(inputtxt.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}