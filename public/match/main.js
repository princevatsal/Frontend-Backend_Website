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
var boxes=document.querySelector('.boxes')
fetch('../api/roomdetails?token='+localStorage.getItem('token')).then(data=>{data.json().then(e=>{
	if(e.error){
		boxes.innerHTML='<div class="head" style="padding: 10px 0 5vh 0;">'+e.msg+'</div>'
	}else{
		var matches=e
		var res=``
		matches.forEach((match)=>{
			res+=`<div class="head" style="padding: 10px 0 10vh 0;">
				<h1>${match.matchname}</h1>
				<p>room_username: ${match.roomid}</p>
				<p>room_password: ${match.roompass}</p>
			</div>`
		})
		boxes.innerHTML=res

	}
})})