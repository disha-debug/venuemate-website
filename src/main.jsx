import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import './styles.css';

const PHONE = '+91 7498 511 765';
const WHATSAPP = '917498511765';
const img = {
  hero: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=88',
  venues: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1510070009289-b5bc34383727?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85'
  ],
  gallery: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85'
  ]
};

const venues = [
  { id:'glasshouse', name:'The Glasshouse', city:'Nagpur', area:'Civil Lines', type:'Wedding', guests:180, price:45000, image:img.venues[0], tag:'Most loved', desc:'Elegant indoor-outdoor space for intimate weddings and celebrations.' },
  { id:'olive', name:'Olive Courtyard', city:'Pune', area:'Koregaon Park', type:'Birthday', guests:120, price:38000, image:img.venues[1], tag:'New on VenueMate', desc:'Warm courtyard venue for birthdays, engagements and private parties.' },
  { id:'casademar', name:'Casa de Mar', city:'Nashik', area:'Gangapur Road', type:'Engagement', guests:90, price:55000, image:img.venues[2], tag:'Editor’s pick', desc:'A stylish celebration space with a relaxed premium atmosphere.' },
  { id:'greenroom', name:'The Green Room', city:'Nagpur', area:'Wardha Road', type:'Corporate', guests:75, price:32000, image:img.venues[3], tag:'Popular', desc:'Modern event space suited to meetings, launches and team gatherings.' },
  { id:'royalorchid', name:'Royal Orchid Lawn', city:'Pune', area:'Baner', type:'Wedding', guests:300, price:85000, image:img.gallery[0], tag:'Large events', desc:'Spacious lawn and banquet setting for larger celebrations.' },
  { id:'terrace', name:'The Terrace House', city:'Nashik', area:'College Road', type:'Birthday', guests:60, price:25000, image:img.gallery[1], tag:'Budget pick', desc:'Cozy terrace venue for smaller gatherings and birthday parties.' }
];

const categories = [
  ['Weddings','Begin beautifully'], ['Birthdays','Make it memorable'], ['Engagements','Start a new chapter'], ['Corporate','Gather differently']
];
const budgets = [{label:'₹50K', max:50000},{label:'₹1L', max:100000},{label:'₹2L', max:200000},{label:'₹2L+', max:Infinity}];
const ease=[.22,1,.36,1];
const rise={hidden:{opacity:0,y:34},show:{opacity:1,y:0,transition:{duration:.72,ease}}};

function Reveal({children,className=''}){return <motion.div className={className} variants={rise} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}}>{children}</motion.div>}
function Stagger({children,className=''}){return <motion.div className={className} variants={{hidden:{},show:{transition:{staggerChildren:.1}}}} initial="hidden" whileInView="show" viewport={{once:true,amount:.12}}>{children}</motion.div>}
function Arrow(){return <span className="arrow">→</span>}
function Button({children,onClick,light=false,type='button'}){return <motion.button type={type} onClick={onClick} whileHover={{scale:1.035}} whileTap={{scale:.97}} className={'button '+(light?'light':'')}>{children} <Arrow/></motion.button>}
function Logo({onClick}){return <a className="brand" href="#top" onClick={onClick}><img src="/venuemate-logo.png" alt="VenueMate"/></a>}
function go(hash){window.location.hash=hash}

function Header({menu,setMenu}){
  const nav=(hash)=>{setMenu(false);go(hash)};
  return <header className="nav">
    <Logo onClick={()=>setMenu(false)}/>
    <nav className="desktop-nav">
      <a href="#finder">Discover</a><a href="#occasions">Occasions</a><a href="#hosts">For hosts</a>
      <Button onClick={()=>nav('login')}>Log in</Button>
    </nav>
    <button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Menu"><i className={menu?'open':''}/><i className={menu?'open':''}/></button>
    <AnimatePresence>{menu&&<motion.div className="mobile-menu" initial={{opacity:0,height:0}} animate={{opacity:1,height:'100vh'}} exit={{opacity:0,height:0}} transition={{duration:.35,ease}}>
      {['finder','occasions','hosts','login'].map((x,i)=><motion.a key={x} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08*i}} href={'#'+x} onClick={()=>setMenu(false)}>{x==='finder'?'Find a venue':x==='hosts'?'For hosts':x[0].toUpperCase()+x.slice(1)}</motion.a>)}
    </motion.div>}</AnimatePresence>
  </header>
}

function Home({setMenu}){
  const {scrollYProgress}=useScroll(); const progress=useSpring(scrollYProgress,{stiffness:100,damping:30}); const heroY=useTransform(scrollYProgress,[0,.45],[0,75]);
  const [selectedBudget,setBudget]=useState(0),[lightbox,setLightbox]=useState(null);
  const filterCategory=(type)=>go('finder?event='+encodeURIComponent(type));
  return <>
    <motion.div className="progress" style={{scaleX:progress}}/>
    <section className="hero" id="top">
      <motion.div className="hero-image" style={{y:heroY}} initial={{clipPath:'inset(10% 8% 10% 8%)',scale:1.12,opacity:0}} animate={{clipPath:'inset(0% 0% 0% 0%)',scale:1,opacity:1}} transition={{duration:1.35,ease}}><img src={img.hero} alt="Beautiful event venue"/></motion.div>
      <div className="hero-overlay"/><div className="hero-copy">
        <motion.div className="eyebrow" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6,ease}}>Made for meaningful moments</motion.div>
        <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.85,delay:.16,ease}}>Find the place<br/>your story deserves.</motion.h1>
        <motion.p initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.34,ease}}>Beautiful spaces for celebrations, gatherings, and the moments that become your favourites.</motion.p>
        <motion.div className="hero-actions" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.65,delay:.5,ease}}><Button onClick={()=>go('finder')}>Find a venue</Button><a href="#venues">Explore spaces <Arrow/></a></motion.div>
      </div><motion.div className="orb orb-one" animate={{y:[0,-12,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}/>
    </section>
    <Stagger className="stats">{[['8,000+','distinctive spaces'],['120','cities and counting'],['4.9 / 5','average guest rating']].map(([n,t])=><motion.div className="stat" variants={rise} key={n}><b>{n}</b><span>{t}</span></motion.div>)}</Stagger>
    <section id="occasions"><Reveal><div className="section-label">Every reason to celebrate</div><h2>Whatever brings you together.</h2></Reveal><Stagger className="category-grid">{categories.map((c,i)=><motion.button variants={rise} whileHover={{y:-8}} className="category" key={c[0]} onClick={()=>filterCategory(c[0])}><span>0{i+1}</span><h3>{c[0]}</h3><p>{c[1]}</p><Arrow/></motion.button>)}</Stagger></section>
    <section id="venues" className="feature-section"><Reveal><div className="section-label">Curated for you</div><div className="heading-row"><h2>Spaces worth gathering in</h2><a href="#finder">See all venues <Arrow/></a></div></Reveal><Stagger className="venue-grid">{venues.slice(0,4).map((v,i)=><VenueCard key={v.id} venue={v} index={i}/>)}</Stagger></section>
    <section id="gallery" className="gallery-section"><Reveal><div className="section-label">A little inspiration</div><h2>Set the scene.</h2></Reveal><Stagger className="gallery">{img.gallery.map((source,i)=><motion.button variants={rise} whileHover={{y:-4}} onClick={()=>setLightbox(i)} className={'gallery-card card-'+i} key={source}><img src={source} alt="Venue inspiration"/><span>View <Arrow/></span></motion.button>)}</Stagger></section>
    <section className="how"><Reveal><div className="section-label">Effortlessly considered</div><h2>From first look to first toast.</h2></Reveal><Stagger className="steps">{[['01','Tell us your occasion','Share the date, place and kind of gathering.'],['02','Find your favourites','Explore hand-picked spaces with clarity.'],['03','Make it yours','Enquire directly and plan with ease.']].map(s=><motion.div variants={rise} className="step" key={s[0]}><b>{s[0]}</b><h3>{s[1]}</h3><p>{s[2]}</p></motion.div>)}</Stagger></section>
    <section className="budget"><Reveal><div className="section-label">Know your number</div><h2>A celebration at every scale.</h2></Reveal><Stagger className="budget-grid">{budgets.map((x,i)=><motion.button variants={rise} whileHover={{y:-5}} onClick={()=>{setBudget(i);go('finder?budget='+x.label)}} className={selectedBudget===i?'selected':''} key={x.label}><b>{x.label}</b><span>Your starting budget</span><Arrow/></motion.button>)}</Stagger></section>
    <section id="hosts" className="host"><Reveal><div><div className="section-label">For venue hosts</div><h2>Your space has a story.<br/>Let’s share it.</h2><p>Join VenueMate and put your venue in front of people looking for exactly what you offer.</p><Button onClick={()=>go('list-your-venue')}>List your venue</Button></div></Reveal></section>
    <AnimatePresence>{lightbox!==null&&<motion.div className="lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLightbox(null)}><button className="close" onClick={()=>setLightbox(null)}>×</button><button className="previous" onClick={e=>{e.stopPropagation();setLightbox((lightbox+3)%4)}}>←</button><motion.img key={lightbox} initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} transition={{duration:.35,ease}} src={img.gallery[lightbox]} alt="Venue gallery" onClick={e=>e.stopPropagation()}/><button className="next" onClick={e=>{e.stopPropagation();setLightbox((lightbox+1)%4)}}>→</button></motion.div>}</AnimatePresence>
  </>
}

function VenueCard({venue,index=0}){return <motion.article variants={rise} whileHover={{y:-8}} className="venue" onClick={()=>go('venue/'+venue.id)}><div className="venue-photo"><img src={venue.image} alt={venue.name}/><div className="photo-shade"/><span>{venue.tag}</span><button onClick={e=>e.stopPropagation()} aria-label="Save venue">♡</button></div><div className="venue-info"><small>{venue.area} · {venue.city}</small><h3>{venue.name}</h3><div><span>Up to {venue.guests} guests</span><b>From ₹{venue.price.toLocaleString('en-IN')}</b></div></div></motion.article>}

function Finder(){
  const params=new URLSearchParams(window.location.hash.split('?')[1]||'');
  const [city,setCity]=useState(params.get('city')||'All'); const [event,setEvent]=useState(params.get('event')||'All'); const [budget,setBudget]=useState(params.get('budget')||'₹2L+'); const [guests,setGuests]=useState('Any');
  const max=budget==='₹50K'?50000:budget==='₹1L'?100000:budget==='₹2L'?200000:Infinity;
  const results=useMemo(()=>venues.filter(v=>(city==='All'||v.city===city)&&(event==='All'||v.type===event)&&(v.price<=max)&&(guests==='Any'||v.guests>=Number(guests))),[city,event,max,guests]);
  return <PageShell title="Find your venue" subtitle="Tell us what you are planning and explore matching spaces."><div className="filters">
    <label>City<select value={city} onChange={e=>setCity(e.target.value)}><option>All</option><option>Nagpur</option><option>Pune</option><option>Nashik</option></select></label>
    <label>Event<select value={event} onChange={e=>setEvent(e.target.value)}><option>All</option><option>Wedding</option><option>Birthday</option><option>Engagement</option><option>Corporate</option></select></label>
    <label>Budget<select value={budget} onChange={e=>setBudget(e.target.value)}><option>₹50K</option><option>₹1L</option><option>₹2L</option><option>₹2L+</option></select></label>
    <label>Guests<select value={guests} onChange={e=>setGuests(e.target.value)}><option>Any</option><option value="50">50+</option><option value="100">100+</option><option value="150">150+</option><option value="250">250+</option></select></label>
  </div><div className="results-head"><h2>{results.length} venue{results.length!==1?'s':''} found</h2><a href="#contact">Need help? Talk to us <Arrow/></a></div><div className="venue-grid results-grid">{results.length?results.map((v,i)=><VenueCard venue={v} index={i} key={v.id}/>):<div className="empty"><h3>No exact matches yet.</h3><p>Try a wider budget, another city, or fewer guest requirements.</p><Button onClick={()=>{setCity('All');setEvent('All');setBudget('₹2L+');setGuests('Any')}}>Reset filters</Button></div>}</div></PageShell>
}

function VenueDetail({id}){const v=venues.find(x=>x.id===id)||venues[0];return <PageShell title={v.name} subtitle={`${v.area} · ${v.city} · ${v.type}`}><div className="detail"><img src={v.image} alt={v.name}/><div className="detail-copy"><span className="pill">{v.tag}</span><h2>Made for your next celebration.</h2><p>{v.desc}</p><div className="detail-stats"><div><b>₹{v.price.toLocaleString('en-IN')}</b><span>starting price</span></div><div><b>{v.guests}</b><span>guest capacity</span></div><div><b>{v.city}</b><span>city</span></div></div><div className="detail-actions"><Button onClick={()=>go('contact?venue='+encodeURIComponent(v.name))}>Enquire now</Button><a className="outline-button" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi VenueMate, I am interested in ${v.name}.`)}`} target="_blank" rel="noreferrer">WhatsApp <Arrow/></a><a className="outline-button" href={`tel:${PHONE.replace(/\s/g,'')}`}>Call <Arrow/></a></div></div></div><h2 className="more-title">More venues</h2><div className="venue-grid">{venues.filter(x=>x.id!==v.id).slice(0,3).map(x=><VenueCard venue={x} key={x.id}/>)}</div></PageShell>}

function FormPage({kind}){const [sent,setSent]=useState(false); const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [message,setMessage]=useState(''); const title=kind==='login'?'Welcome back':'Let’s plan your event'; const submit=e=>{e.preventDefault();setSent(true)};return <PageShell title={title} subtitle={kind==='login'?'Sign in to manage your VenueMate enquiries.':'Tell us what you need and our team can help you find suitable venues.'}><div className="form-card">{sent?<div className="success"><div className="success-icon">✓</div><h2>Thanks, {name||'there'}.</h2><p>Your request has been captured in this demo. For immediate help, call or WhatsApp us at {PHONE}.</p><div className="form-actions"><a className="outline-button" href={`tel:${PHONE.replace(/\s/g,'')}`}>Call VenueMate</a><a className="outline-button" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a></div></div>:<form onSubmit={submit}><label>Name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Phone<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91..."/></label>{kind!=='login'&&<><label>Event type<select><option>Wedding</option><option>Birthday</option><option>Engagement</option><option>Corporate</option></select></label><label>Budget<select><option>₹50K</option><option>₹1L</option><option>₹2L</option><option>₹2L+</option></select></label><label>Message<textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us about your event"/></label></>}<Button type="submit">{kind==='login'?'Continue':'Send enquiry'}</Button></form>}</div></PageShell>}

function HostForm(){return <FormPage kind="host"/>}
function PageShell({title,subtitle,children}){return <><div className="page-top"><a href="#top" className="back">← Home</a><Logo/><div className="page-spacer"/></div><main className="page"><Reveal><div className="section-label">VenueMate</div><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></Reveal>{children}</main><footer><Logo/><p>Find beautiful venues for the moments that matter.</p><small>© 2026 VenueMate · {PHONE}</small></footer></>}

function App(){const [route,setRoute]=useState(window.location.hash.slice(1)||'top'); const [menu,setMenu]=useState(false); useEffect(()=>{const on=()=>{setRoute(window.location.hash.slice(1)||'top');window.scrollTo({top:0,behavior:'smooth'});setMenu(false)};window.addEventListener('hashchange',on);return()=>window.removeEventListener('hashchange',on)},[]); const path=route.split('?')[0]; let content; if(path==='finder')content=<Finder/>; else if(path==='login')content=<FormPage kind="login"/>; else if(path==='contact')content=<FormPage kind="contact"/>; else if(path==='list-your-venue')content=<HostForm/>; else if(path.startsWith('venue/'))content=<VenueDetail id={path.split('/')[1]}/>; else content=<><Header menu={menu} setMenu={setMenu}/><Home setMenu={setMenu}/><footer><Logo/><p>The warmest way to find a place for the people and moments you love.</p><div className="footer-links"><a href="#finder">Find a venue</a><a href="#contact">Contact</a><a href="#list-your-venue">List your venue</a><a href={`tel:${PHONE.replace(/\s/g,'')}`}>{PHONE}</a></div><small>© 2026 VenueMate · Privacy · Terms</small></footer></>;
 return content;
}
createRoot(document.getElementById('root')).render(<App/>);
