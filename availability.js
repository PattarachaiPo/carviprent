/* Browser-only availability preview for the static booking demo. */
(() => {
  const STORE='prosperPlusDemoReservations';
  const bookings=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch{return []}};
  window.checkVehicleAvailability=(vehicleKey,start,end)=>{
    if(!start||!end||end<start)return {ok:false,message:'กรุณาเลือกช่วงวันที่ให้ถูกต้อง'};
    const conflict=bookings().find(r=>r.vehicleKey===vehicleKey&&r.startDate<=end&&r.endDate>=start);
    return conflict?{ok:false,message:`รถคันนี้มีรายการจองระหว่างวันที่ ${new Date(conflict.startDate+'T00:00:00').toLocaleDateString('th-TH')} – ${new Date(conflict.endDate+'T00:00:00').toLocaleDateString('th-TH')}`}:{ok:true,message:'รถว่างในช่วงวันที่เลือก (ข้อมูลตัวอย่างในเบราว์เซอร์นี้)'};
  };
  window.saveDemoReservation=booking=>{
    const all=bookings();all.push({reference:booking.reference,vehicleKey:booking.vehicleKey,startDate:booking.startDate,endDate:booking.endDate});
    localStorage.setItem(STORE,JSON.stringify(all));
  };
  window.initAvailabilityCalendar=({vehicleKey,getStart,getEnd,setStart,setEnd,onChange})=>{
    const root=document.querySelector('#availabilityCalendar');if(!root)return;
    const now=new Date();let shown=new Date(now.getFullYear(),now.getMonth(),1);
    const monthTitle=root.querySelector('[data-month]'),days=root.querySelector('[data-days]');
    const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const render=()=>{
      monthTitle.textContent=shown.toLocaleDateString('th-TH',{month:'long',year:'numeric'});days.innerHTML='';
      const offset=(shown.getDay()+6)%7;for(let i=0;i<offset;i++){const blank=document.createElement('span');blank.className='calendar-empty';days.append(blank)}
      const count=new Date(shown.getFullYear(),shown.getMonth()+1,0).getDate();const todayKey=dateKey(now);
      for(let n=1;n<=count;n++){
        const d=new Date(shown.getFullYear(),shown.getMonth(),n),key=dateKey(d),busy=bookings().some(r=>r.vehicleKey===vehicleKey&&r.startDate<=key&&r.endDate>=key);
        const btn=document.createElement('button');btn.type='button';btn.textContent=n;btn.className='calendar-day';
        if(key<todayKey){btn.classList.add('past');btn.disabled=true}else if(busy){btn.classList.add('busy');btn.title='มีรายการจองแล้ว'}else btn.classList.add('free');
        const start=getStart(),end=getEnd();if(key===start||key===end)btn.classList.add('selected');else if(start&&end&&key>start&&key<end)btn.classList.add('in-range');
        btn.addEventListener('click',()=>{const s=getStart(),e=getEnd();if(!s||e||key<s){setStart(key);setEnd('')}else setEnd(key);render();onChange()});days.append(btn);
      }
    };
    root.querySelector('[data-prev]').addEventListener('click',()=>{shown=new Date(shown.getFullYear(),shown.getMonth()-1,1);render()});
    root.querySelector('[data-next]').addEventListener('click',()=>{shown=new Date(shown.getFullYear(),shown.getMonth()+1,1);render()});
    root.refresh=render;render();
  };
})();
