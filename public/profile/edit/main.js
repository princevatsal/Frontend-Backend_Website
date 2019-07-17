//fetching basic detils
var container=document.querySelector('.container')
var userr=document.querySelector('.p-user')
var phonee=document.querySelector('.p-phone')
var paytmm=document.querySelector('.p-paytm')
fetch('../../api/userdetails?token='+localStorage.getItem('token')).then((data)=>{
	data.json().then((obj)=>{
		if(obj.noerror){
			userr.innerHTML=obj.username
			phonee.innerHTML=obj.phone
			paytmm.innerHTML=obj.paytm
		}
	})
})
//

//css
var special=document.querySelector('.special')
	var ul=document.querySelector('.menu ul')
	var is=document.querySelector('.menu').querySelectorAll('i')
	is.forEach((element,index)=>{
		element.addEventListener('mouseover',()=>{
			ul.style.margin='1px 0px'
			for(var h=0;h<5;h++){
				if(h!=index){
					is[h].style.top='15px'
				}
			}
					})
		element.addEventListener('mouseleave',()=>{
			ul.style.margin='16px 0px'
			for(var h=0;h<5;h++){
				if(h!=index){
					is[h].style.top='0px'
				}
			}
					})
	})
//css

//money 
var money=document.querySelector('.money p')
	var xml3=new XMLHttpRequest()
	var token=localStorage.getItem('token')
	xml3.open('GET','/api/wallet?token='+token)
	xml3.onload=function(){
		var resp=JSON.parse(this.responseText)
		if(resp.expired && resp.refresh && resp.refreshed){
			localStorage.setItem('token',resp.refreshed)
			fetch('/api/wallet?token='+localStorage.getItem('token')).then((res)=>{res.json().then((rt)=>{
				money.innerHTML='RS.'+rt.wallet
			})})
		}else{
			if(resp.logout){
				window.location.href='/logout'
			}
			if(resp.noerror){
				money.innerHTML='RS.'+resp.wallet
			}
		}
	}
	xml3.send()
//

var images=document.querySelectorAll('.inputbox img')
var ps=document.querySelectorAll('.inputbox p')
var labels=document.querySelectorAll('.inputbox label')
var inputs=document.querySelectorAll('.inputbox input')
var submit=document.querySelector('.submit')
images.forEach((image,index)=>{
	image.addEventListener('click',()=>{
		images.forEach((image)=>{image.click()})
		inputs[index].style.display='block'
		labels[index].style.position='absolute'
		ps[index].style.display='none'
		inputs[index].value=ps[index].innerHTML
		images[index].style.display='none'
		if(submit.style.display!='block'){
			submit.style.display='block'
		}
	})
})

var form =document.querySelector('form')
form.addEventListener('submit',(e)=>{
e.preventDefault()
var username=inputs[0].value.trim()	
var phone=inputs[1].value.trim()	
var paytm=inputs[2].value.trim()
console.log(username,phone,paytm)
if(username==''){
	alert('Please fill in username')
	return
}
if(phone==''){
	alert('Please fill in phone')
	return
}
if(paytm==''){
	alert('Please fill in phone number')
	return
}
	if(!phonenumber(phone)){
		alert('please enter phone no correctly')
		return
	}
	if(!phonenumber(paytm)){
		alert('please enter paytm phone no correctly')
		return
	}
if(username && phone &&paytm ){
	document.querySelector('.wait').style.display='block'
	submit.style.display='none'
	window.location.href='../../api/updateuser?token='+localStorage.getItem('token')+'&username='+username+'&phone='+phone+'&paytm='+paytm
}
})

function phonenumber(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(inputtxt.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}