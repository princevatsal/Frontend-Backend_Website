const buttons=document.querySelector('.buttons')
const add=document.querySelector('.add')
const redeem=document.querySelector('.redeem')
const addmoney=document.querySelector('.addmoney')
const redeemmoney=document.querySelector('.redeemmoney')
const moneyinput=document.querySelector('.moneyinput')
const moneyinput2=document.querySelector('.moneyinput2')
const submit1=document.querySelector('.submit1')
const submit2=document.querySelector('.submit2')
add.addEventListener('click',()=>{
	add.style.display='none'
	redeem.style.display='none'
	addmoney.style.display='block'
})

redeem.addEventListener('click',()=>{
	redeem.style.display='none'
	add.style.display='none'
	redeemmoney.style.display='block'
})
// redeem.click()

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
var token=localStorage.getItem('token')

moneyinput.addEventListener('keyup',(e)=>{
	if(/^\d*$/.test(moneyinput.value)){
		var amount=Number(moneyinput.value)
		submit1.innerHTML='Add Rs <br> '+amount
		if(amount>20000){
			alert('Please enter amount less than 10000')
			moneyinput.value=''
			submit1.innerHTML='Add Rs <br> 0'
			submit1.href=''
		}
		else{

		if(amount==0){
			submit1.href=''
			submit1.innerHTML='Add  <br>'
		}else{submit1.href='../../paywithpaytm?amount='+amount+'&token='+token}
	
		}
	}
	else{
		alert('please enter a number')
		moneyinput.value=''
		submit1.href=''
	}
})

moneyinput2.addEventListener('keyup',(e)=>{
	if(/^\d*$/.test(moneyinput2.value)){
		var amount=Number(moneyinput2.value)
		submit2.innerHTML='Withdraw <br>Rs '+amount
		if(amount>20000){
			alert('Please enter amount less than 10000')
			moneyinput2.value=''
			submit2.innerHTML='Withdraw  <br>'
			submit2.href=''
		}
		else{
		if(amount==0){
			submit2.href=''
			submit2.innerHTML='Withdraw  <br>'
		}else{submit2.href='../../api/redeem?amount='+amount+'&token='+token}
	
	}
	}
	else{
		alert('please enter a number')
		moneyinput2.value=''
		submit2.href=''
	}
})
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