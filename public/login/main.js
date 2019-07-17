const EMAIL=document.querySelector('#Email')
const password=document.querySelector('#password')
const submit=document.querySelector('#submit')
const form=document.querySelector('form')
const wait=document.querySelector('.wait')

form.addEventListener('submit',(e)=>{
	e.preventDefault()	
	email=EMAIL.value.trim()
	pass=password.value.trim()
	if(email==''){
		alert('please fill in Email')
		return
	}
	if(pass==''){
		alert('please fill in password')
		return
	}
	var tosend=`{
		"email":"${email}",
		"password":"${pass}"
	}`
	wait.style.display='block'
	submit.style.display='none'
	var xml=new XMLHttpRequest()
	xml.open('post','../api/login',true)
	xml.setRequestHeader('Content-Type', 'application/json');
	xml.onload=function(){
		if(this.status==200){
			try{
			var data=JSON.parse(this.responseText)
			console.log(data)
			if(data.error==true && data.alert){
				alert(data.alert)
				wait.style.display='none'
				submit.style.display='block'
				return
			}
			if(data.error=='none' && data.msg){
				localStorage.setItem('token', data.token);
				window.location.href='../'
			}
		}
			catch(error){
				alert('Please Login Again ')
			}
		}
	}
	xml.send(tosend)
})