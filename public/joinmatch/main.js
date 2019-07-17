//money 
var money=document.querySelector('.money')
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
				money.innerHTML='Rs.'+resp.wallet
			}
		}
	}
	xml3.send()
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

var id=window.location.href.split('matchId=')[1]
//load match name
if(id)
	{
		fetch('../api').then((data)=>{data.json().then((res)=>{
			console.log('fetched')
	res.forEach((obj)=>{
		if(obj.matchId==id){
			var str=`
			<div class="boxrow">
			<div class="box1">
				<div class="head">
					<img src="../images/mainlogo.png" alt="">
					<p>${obj.Matchname}</p>
				</div>
				<div class="time"> Time : ${obj.Time}</div>
				<div class="body">
					<div class="col">
						<div class="row">
							<p>Win Price</p><b>${obj.Win}</b>
						</div>
					</div>
					<div class="col">
						<div class="row">
							<p>Per Kill</p><b>${obj.Perkill}</b>
						</div>
					</div>
					<div class="col">
						<div class="row">
							<p>Entry Fee</p><b>${obj.entryfee}</b>
						</div>
					</div>
				</div>
					<div class="meter">
						<p>Joined:${obj.join}/${obj.totaluser}</p>
		  				<span style="width:${(obj.join/obj.totaluser)*100}%"></span>
					</div>				
			</div>
		</div>
		<a href="../api/joinme?token=${localStorage.getItem('token')}&matchId=${id}" style="text-decoration:none;"><div class="btn" >Pay Rs.${obj.entryfee}</div></a>
			`
			console.log('paytm')
		document.querySelector('.container').innerHTML=str
		}
	})
})})
	}
//
