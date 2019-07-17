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
function modify(data){
boxes=document.getElementsByClassName('boxes')[0]
var str='';
var count=0;
// data.forEach((obj)=>{///abracket at 68
for(var i=data.length-1;i>=0;i--){
obj=data[i]
count++;
if(count==1){
str+=`
<div class='boxrow'>`
}
str+=`
<div class="box1">
		<div class="head">
			<img src="images/mainlogo.png" alt="">
			<p>${obj.Matchname}</p>
		</div>
		<div class="time"> Time : ${obj.Time}</div>
		<div class="body">
			<div class="col">
				<div class="row"><p>Win Price</p><b>${obj.Win}</b></div>
				<div class="row"><p>Type</p><b>${obj.type}</b></div>
			</div>
			<div class="col">
				<div class="row"><p>Per Kill</p><b>${obj.Perkill}</b></div>
				<div class="row"><p>Version</p><b>${obj.version}</b></div>
			</div>
			<div class="col">
				<div class="row"><p>Entry Fee</p><b>${obj.entryfee}</b></div>
				<div class="row"><p>Map</p><b>Erangel</b></div>
			</div>
		</div>
			<div class="meter">
				<p>Joined:${obj.join}/${obj.totaluser}</p>
  				<span style="width:${(obj.join/obj.totaluser)*100}%"></span>
			</div>
			<a href="${((obj.join/obj.totaluser)*100)==100?'#':'/joinmatch?matchId='+obj.matchId}" style='text-decoration:none;'><div class="btn"  style="background:${((obj.join/obj.totaluser)*100)==100?'grey':'#005e82'};">Join Now</div></a>
	</div>
`
if(count==3){
	str+=`</div>`
	count=0;
}
}
boxes.innerHTML+=str;
}

var xml= new XMLHttpRequest()
xml.open('GET','api',true)
xml.onload=function(){
	if(xml.status==200)
	 modify(JSON.parse(this.responseText))
console.log(JSON.parse(this.responseText))
}
xml.send()

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