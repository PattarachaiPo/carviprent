const FLEET={
 mpv:{name:'รถ MPV หรู',capacity:'ผู้โดยสารสูงสุด 6 คน',class:'พรีเมียม',price:1800,image:'https://res.klook.com/image/upload/activities/zxv5l9knswiybe1ouenk.jpg',description:'ห้องโดยสารกว้างขวาง เหมาะสำหรับครอบครัว เดินทางพร้อมสัมภาระ หรือรับรองแขกคนสำคัญ'},
 sedan:{name:'รถซีดานผู้บริหาร',capacity:'ผู้โดยสารสูงสุด 3 คน',class:'ผู้บริหาร',price:1400,image:'https://lirp.cdn-website.com/e2cfea54/dms3rep/multi/opt/Airport%2Btransfer-1920w.webp',description:'เดินทางอย่างสะดวกสบาย เหมาะสำหรับธุรกิจและการเดินทางในเมือง'},
 suv:{name:'รถ SUV พรีเมียม / รถตู้ VIP',capacity:'จำนวนที่นั่งขึ้นอยู่กับรุ่นรถ',class:'พรีเมียม',price:2200,image:'https://res.klook.com/image/upload/activities/zxv5l9knswiybe1ouenk.jpg',description:'พื้นที่กว้างและยืดหยุ่น เหมาะกับการเดินทางเป็นกลุ่มและมีสัมภาระ'}
};
const getBooking=()=>{try{return JSON.parse(sessionStorage.getItem('prosperPlusBooking')||'{}')}catch{return {}}};
const saveBooking=b=>sessionStorage.setItem('prosperPlusBooking',JSON.stringify(b));
const params=new URLSearchParams(location.search);let booking=getBooking();
function vehicleKey(){const key=params.get('vehicle')||booking.vehicleKey||'mpv';return FLEET[key]?key:'mpv'}
function rentalDays(start,end){if(!start||!end||end<start)return 1;return Math.floor((Date.parse(end+'T00:00:00')-Date.parse(start+'T00:00:00'))/86400000)+1}
function money(n){return new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:0}).format(n||0)}
function serviceName(v){return ({'Airport Transfer':'รับส่งสนามบิน','Point-to-Point':'รับส่งตามจุดหมาย','Hourly Chauffeur':'เหมารถรายชั่วโมง','Daily Chauffeur':'เหมารถรายวัน','Intercity Trip':'เดินทางระหว่างจังหวัด'})[v]||v||'รับส่งสนามบิน'}
function dateThai(d){if(!d)return '-';return new Date(d+'T00:00:00').toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'})}
function summaryRows(b){const daily=FLEET[b.vehicleKey]?.price||0,days=rentalDays(b.startDate||b.date,b.endDate||b.date);let rows=[['บริการ',serviceName(b.service)],['รถ',FLEET[b.vehicleKey]?.name||'รถที่เหมาะสม'],['จุดรับ',b.pickup||'-'],['จุดหมาย',b.destination||'-'],['ช่วงวันที่ใช้รถ',`${dateThai(b.startDate||b.date)} – ${dateThai(b.endDate||b.date)}`],['จำนวนวัน',`${days} วัน`],['เวลารับ',b.time||'-'],['ผู้โดยสาร',`${b.passengers||'-'} คน`]];return rows.map(([k,v])=>`<div class="summary-row"><span>${k}</span><b>${v}</b></div>`).join('')+`<div class="summary-row"><span>ราคาต่อวัน</span><b>${money(daily)}</b></div>`}
function showSummary(target,b,price=false){const node=document.querySelector(target);if(!node)return;node.innerHTML=summaryRows(b)+(price?`<div class="summary-row total"><span>สรุปราคารวม</span><span>${money(b.amount)}</span></div>`:'')}
function activateStep(step){document.querySelectorAll('.step').forEach((el,i)=>el.classList.toggle('active',i===step))}
function startBooking(key){booking.vehicleKey=key;saveBooking(booking);location.href='booking.html'}
const page=document.body.dataset.page;
if(page==='fleet'){
 document.querySelector('#fleetGrid').innerHTML=Object.entries(FLEET).map(([key,v])=>`<article class="card"><img src="${v.image}" alt="${v.name} ใช้รับส่งผู้โดยสาร" loading="lazy"><div class="card-body"><h2>${v.name}</h2><p class="muted">${v.description}</p><div class="specs"><span>${v.capacity}</span><span>${v.class}</span></div><a class="btn" href="vehicle-detail.html?vehicle=${key}">ดูรายละเอียดรถ</a></div></article>`).join('');
}
if(page==='detail'){
 const key=vehicleKey(),v=FLEET[key];booking.vehicleKey=key;saveBooking(booking);
 document.querySelector('#detailImage').src=v.image;document.querySelector('#detailImage').alt=v.name;
 document.querySelector('#vehicleName').textContent=v.name;document.querySelector('#vehicleNamePanel').textContent=v.name;document.querySelector('#vehicleDescription').textContent=v.description;document.querySelector('#vehicleCapacity').textContent=v.capacity;document.querySelector('#vehicleClass').textContent=v.class;
 document.querySelector('#startBooking').onclick=()=>startBooking(key);
}
if(page==='booking'){
 activateStep(1);const form=document.querySelector('#bookingForm');const v=FLEET[vehicleKey()];booking.vehicleKey=vehicleKey();
 for(const id of ['service','pickup','destination','startDate','endDate','time','passengers','luggage','name','phone','email'])if(booking[id]!=null&&form.elements[id])form.elements[id].value=booking[id];
 if(!form.elements.startDate.value&&booking.date)form.elements.startDate.value=booking.date;
 if(!form.elements.endDate.value&&booking.date)form.elements.endDate.value=booking.date;
 form.elements.service.value=booking.service||'Airport Transfer';form.elements.passengers.value=booking.passengers||'2';form.elements.luggage.value=booking.luggage||'2';
 const today=new Date();const todayKey=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);form.elements.startDate.min=todayKey;form.elements.endDate.min=form.elements.startDate.value||todayKey;
 const message=document.querySelector('#availabilityMessage');
 const updateAvailability=()=>{
   const start=form.elements.startDate.value,end=form.elements.endDate.value;form.elements.endDate.min=start||todayKey;
   if(!start||!end){message.textContent='เลือกวันเริ่มต้นและวันสิ้นสุด ระบบจะแสดงผลตรวจสอบรถว่าง';message.className='availability-message';return false}
   const result=window.checkVehicleAvailability(vehicleKey(),start,end);message.textContent=result.message;message.className='availability-message '+(result.ok?'ok':'error');return result.ok;
 };
 window.initAvailabilityCalendar({vehicleKey:vehicleKey(),getStart:()=>form.elements.startDate.value,getEnd:()=>form.elements.endDate.value,setStart:value=>{form.elements.startDate.value=value;form.elements.endDate.min=value},setEnd:value=>form.elements.endDate.value=value,onChange:updateAvailability});
 form.elements.startDate.addEventListener('change',()=>{if(form.elements.endDate.value<form.elements.startDate.value)form.elements.endDate.value='';document.querySelector('#availabilityCalendar').refresh();updateAvailability()});
 form.elements.endDate.addEventListener('change',()=>{document.querySelector('#availabilityCalendar').refresh();updateAvailability()});
 document.querySelector('#bookingVehicle').value=v.name;document.querySelector('#bookingVehicleSummary').textContent=v.name;document.querySelector('#bookingPrice').textContent=money(v.price);
 const updatePrice=()=>{const start=form.elements.startDate.value,end=form.elements.endDate.value,valid=!!start&&!!end&&end>=start,days=valid?rentalDays(start,end):0;document.querySelector('#rentalDaysCount').textContent=valid?`${days} วัน`:'เลือกวันที่';document.querySelector('#dailyRate').textContent=money(v.price);document.querySelector('#bookingPrice').textContent=valid?money(v.price*days):'-'};
 form.elements.startDate.addEventListener('change',updatePrice);form.elements.endDate.addEventListener('change',updatePrice);updatePrice();
 form.noValidate=true;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity()){message.textContent='กรุณากรอกข้อมูลที่จำเป็นให้ครบและตรวจสอบรูปแบบข้อมูล';message.className='availability-message error';return}if(form.elements.destination.value.trim().toLowerCase()===form.elements.pickup.value.trim().toLowerCase()){message.textContent='จุดรับและจุดหมายต้องไม่ซ้ำกัน';message.className='availability-message error';form.elements.destination.focus();return}if(!updateAvailability())return;const fd=new FormData(form);for(const [k,val] of fd.entries())booking[k]=val;booking.date=booking.startDate;booking.amount=v.price*rentalDays(booking.startDate,booking.endDate);booking.vehicleKey=vehicleKey();saveBooking(booking);location.href='payment.html'});
}
if(page==='payment'){
 activateStep(2);if(!booking.pickup||!booking.destination||!booking.name||!booking.startDate||!booking.endDate){location.href='booking.html';}else{booking.amount=FLEET[vehicleKey()].price*rentalDays(booking.startDate,booking.endDate);const result=window.checkVehicleAvailability(vehicleKey(),booking.startDate,booking.endDate);showSummary('#paymentSummary',booking,true);const status=document.createElement('p');status.className='notice '+(result.ok?'':'availability-message error');status.textContent=result.message;document.querySelector('#paymentSummary').after(status);document.querySelector('#paymentMethod').addEventListener('change',e=>document.querySelector('#payButton').textContent=e.target.value==='transfer'?'ยืนยันการโอนเงิน (ทดลอง)':'ชำระเงิน (ทดลอง)');document.querySelector('#paymentForm').addEventListener('submit',e=>{e.preventDefault();const check=window.checkVehicleAvailability(vehicleKey(),booking.startDate,booking.endDate);if(!check.ok){status.textContent=check.message;return}booking.status='ชำระเงินสำเร็จ (ทดลอง)';booking.reference='PRE-'+new Date().toISOString().slice(2,10).replaceAll('-','')+'-'+Math.floor(1000+Math.random()*9000);booking.paidAt=new Date().toISOString();window.saveDemoReservation(booking);saveBooking(booking);location.href='confirmation.html'})}}
if(page==='confirmation'){
 activateStep(3);if(!booking.reference){location.href='fleet.html';}else{document.querySelector('#bookingReference').textContent=booking.reference;document.querySelector('#paidStatus').textContent=booking.status;showSummary('#confirmationSummary',booking,true);document.querySelector('#customerName').textContent=booking.name||'-'}
}
