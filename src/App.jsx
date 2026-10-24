import { useEffect, useMemo, useState } from 'react'
import {
  Activity, Apple, Check, ChevronRight, CircleCheck, Droplets, Dumbbell,
  Flame, GlassWater, House, RotateCcw, Salad, Settings2, Target, Utensils,
  Waves, Weight, Zap
} from 'lucide-react'

const STORAGE_KEY = 'fittrack30-v1'
const bottleMl = 330
const waterGoal = 7

const meals = [
  {
    id: 'breakfast', time: '9:00 AM', title: 'Breakfast', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1000&q=85',
    protein: 24, items: [
      { id: 'oats', name: 'Oats', amount: '60 g dry', protein: 8 },
      { id: 'milk', name: 'Milk', amount: '250 ml', protein: 8 },
      { id: 'banana', name: 'Banana', amount: '1 medium', protein: 1 },
      { id: 'yogurt', name: 'Regular yogurt', amount: '200 g', protein: 7 },
    ],
    tip: 'Mix the oats with milk and eat the banana and yogurt on the side. No morning eggs needed.'
  },
  {
    id: 'lunch', time: '1:30 PM', title: 'Work lunch', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=85',
    protein: 51, items: [
      { id: 'chicken', name: 'Cooked chicken breast', amount: '150 g cooked', protein: 46 },
      { id: 'rice', name: 'Cooked rice', amount: '200 g cooked', protein: 5 },
    ],
    tip: 'Chicken weights are after cooking. Add vegetables when available.'
  },
  {
    id: 'snack', time: '5:00 PM', title: 'Work-shift meal', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85',
    protein: 19, items: [
      { id: 'bread', name: 'Brown sliced bread', amount: '2 slices', protein: 6 },
      { id: 'eggs', name: 'Eggs', amount: '2 large, pan-cooked', protein: 13 },
      { id: 'apple', name: 'Apple', amount: '1 medium', protein: 0.5 },
    ],
    tip: 'If you cannot cook eggs, swap them for about 60–70 g cooked chicken.'
  },
  {
    id: 'dinner', time: 'After your workout', title: 'Dinner & recovery', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85',
    protein: 45, items: [
      { id: 'fish', name: 'Baked fish fillet', amount: '180 g cooked', protein: 41 },
      { id: 'rice2', name: 'Cooked rice', amount: '150 g cooked', protein: 4 },
    ],
    tip: 'Swap the fish for 150 g cooked chicken if preferred. Split the meal around your workout if eating late feels uncomfortable.'
  },
]

const workouts = [
  { id: 'mon', day: 'Monday', short: 'MON', title: 'Upper body A', focus: 'Chest priority', exercises: [
    ['Bench press', '3 × 6–10', 'https://images.unsplash.com/photo-1534368270820-9de3d8053204?auto=format&fit=crop&w=800&q=80', 'Lower the bar toward the middle of your chest, then press up. Use a spotter for heavy sets.'],
    ['Incline dumbbell press', '3 × 8–12', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 'Use a 15–30° incline. Lower the dumbbells beside your upper chest and press smoothly.'],
    ['Seated cable row', '3 × 8–12', 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=800&q=80', 'Sit upright and pull the handle toward your lower ribs without rocking.'],
    ['Lat pulldown', '3 × 8–12', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80', 'Pull the bar toward your upper chest. Avoid pulling behind your neck.'],
    ['Dumbbell lateral raise', '3 × 12–20', 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800&q=80', 'Use light weights and raise your arms to about shoulder height.'],
    ['Triceps pushdown', '2 × 10–15', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80', 'Keep elbows near your sides and straighten your arms without swinging.'],
  ]},
  { id: 'tue', day: 'Tuesday', short: 'TUE', title: 'Lower body A', focus: 'Legs & core', exercises: [
    ['Leg press', '3 × 8–12', 'https://images.unsplash.com/photo-1534368270820-9de3d8053204?auto=format&fit=crop&w=800&q=80', 'Lower the platform under control; keep your lower back against the pad.'],
    ['Romanian deadlift', '3 × 8–10', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', 'Push hips back, keep your back neutral, and keep weights close to your legs.'],
    ['Leg curl', '3 × 10–15', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 'Curl smoothly and lower the weight slowly.'],
    ['Calf raises', '3 × 12–15', 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800&q=80', 'Rise onto your toes, pause, and lower through a comfortable stretch.'],
    ['Forearm plank', '3 × 30–60 sec', 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80', 'Keep your body in a straight line and brace your abdomen.'],
  ]},
  { id: 'wed', day: 'Wednesday', short: 'WED', title: 'Recovery day', focus: 'Recover & recharge', exercises: [
    ['Easy walk', '10–20 min', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80', 'Walk at a comfortable pace.'],
    ['Gentle stretching', '5–10 min', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', 'Move gently without forcing any stretch.'],
    ['Hydration check', 'Throughout the day', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80', 'Drink regularly and according to thirst.'],
  ]},
  { id: 'thu', day: 'Thursday', short: 'THU', title: 'Upper body B', focus: 'Chest priority', exercises: [
    ['Incline chest press', '3 × 8–12', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 'Set handles level with your upper chest and press smoothly.'],
    ['Assisted chest dips', '2 × 8–12', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80', 'Lean forward slightly and only lower as far as your shoulders comfortably allow.'],
    ['Cable chest fly', '2 × 12–15', 'https://images.unsplash.com/photo-1534368270820-9de3d8053204?auto=format&fit=crop&w=800&q=80', 'Keep a soft bend in your elbows and bring your arms together without jerking.'],
    ['Lat pulldown', '3 × 8–12', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80', 'Pull toward your upper chest and control the return.'],
    ['Seated cable row', '2 × 10–12', 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=800&q=80', 'Pull with your back muscles and avoid shrugging.'],
    ['Dumbbell curls', '2 × 10–15', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 'Keep elbows near your sides and avoid swinging.'],
    ['Lateral raises', '2 × 12–20', 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800&q=80', 'Use controlled repetitions.'],
  ]},
  { id: 'fri', day: 'Friday', short: 'FRI', title: 'Recovery day', focus: 'Light movement', exercises: [
    ['Easy walk', '10–20 min', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80', 'Walk comfortably, no need to push hard.'],
    ['Rest & hydration', 'All day', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80', 'Give your muscles time to recover.'],
  ]},
  { id: 'sat', day: 'Saturday', short: 'SAT', title: 'Lower body B + abs', focus: 'Legs & core', exercises: [
    ['Squat or hack squat', '3 × 8–12', 'https://images.unsplash.com/photo-1534368270820-9de3d8053204?auto=format&fit=crop&w=800&q=80', 'Keep feet planted and knees tracking in line with toes.'],
    ['Hip thrust', '3 × 8–12', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', 'Drive through your feet and squeeze your glutes without overextending your back.'],
    ['Leg extension', '3 × 10–15', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 'Extend knees smoothly and lower the weight under control.'],
    ['Leg curl', '2 × 10–15', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 'Curl the pad smoothly without momentum.'],
    ['Hanging knee raises', '3 × 10–15', 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80', 'Raise your knees without swinging. Use a captain’s chair if needed.'],
  ]},
  { id: 'sun', day: 'Sunday', short: 'SUN', title: 'Full rest', focus: 'Reset for next week', exercises: [
    ['Recovery', 'Rest day', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', 'Prioritize sleep and recovery.'],
    ['Meal preparation', 'Optional', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80', 'Prepare convenient food for your work shifts.'],
  ]},
]

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function App() {
  const [data, setData] = useState(loadData)
  const [tab, setTab] = useState('Today')
  const [workoutDay, setWorkoutDay] = useState(['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()])
  const [dayCount, setDayCount] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [weightEntry, setWeightEntry] = useState('')
  const [waistEntry, setWaistEntry] = useState('')
  const [notice, setNotice] = useState('')

  const dateKey = todayKey()
  const today = data.days?.[dateKey] || { meals: [], water: 0, exercises: [] }
  const progress = data.progress || []
  const profile = data.profile || { weight: 65, height: 165, age: 24, waterGoal: 7 }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setHeaderColor?.('#101d32')
      tg.setBackgroundColor?.('#f5f7fb')
    }
  }, [])

  function updateToday(patch) {
    setData(prev => {
      const days = { ...(prev.days || {}) }
      days[dateKey] = { ...(days[dateKey] || { meals: [], water: 0, exercises: [] }), ...patch }
      return { ...prev, days }
    })
  }
  function toggleMeal(id) {
    const current = today.meals || []
    updateToday({ meals: current.includes(id) ? current.filter(x => x !== id) : [...current, id] })
  }
  function toggleExercise(id) {
    const current = today.exercises || []
    updateToday({ exercises: current.includes(id) ? current.filter(x => x !== id) : [...current, id] })
  }
  function setWater(n) { updateToday({ water: Math.max(0, n) }) }
  function saveMeasurement() {
    if (!weightEntry && !waistEntry) return
    const entry = { date: dateKey, weight: weightEntry ? Number(weightEntry) : null, waist: waistEntry ? Number(waistEntry) : null }
    setData(prev => ({ ...prev, progress: [...(prev.progress || []).filter(x => x.date !== dateKey), entry] }))
    setWeightEntry(''); setWaistEntry('')
    setNotice('Measurements saved on this device.')
    setTimeout(() => setNotice(''), 2400)
  }
  const checkedMealIds = today.meals || []
  const protein = meals.reduce((sum, m) => sum + (checkedMealIds.includes(m.id) ? m.protein : 0), 0)
  const mealProgress = checkedMealIds.length / meals.length * 100
  const exerciseList = workouts.find(w => w.id === workoutDay) || workouts[0]
  const checkedExercises = today.exercises || []
  const waterGoalMl = profile.waterGoal * bottleMl
  const waterMl = (today.water || 0) * bottleMl

  const nav = [
    { id: 'Today', icon: House, label: 'Today' },
    { id: 'Meals', icon: Utensils, label: 'Meals' },
    { id: 'Water', icon: GlassWater, label: 'Water' },
    { id: 'Workout', icon: Dumbbell, label: 'Workout' },
    { id: 'Progress', icon: Activity, label: 'Progress' },
  ]

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark"><Dumbbell size={22}/></div>
      <div className="brand-copy"><span className="eyebrow">YOUR 30-DAY PLAN</span><h1>FitTrack <b>30</b></h1></div>
      <button className="icon-btn settings-btn" aria-label="Settings" onClick={() => setShowSettings(!showSettings)}><Settings2 size={20}/></button>
    </header>

    {showSettings && <section className="settings-panel card">
      <div className="section-heading"><div><h2>Profile & targets</h2><p>Personalize your starting targets.</p></div></div>
      <div className="settings-grid">
        <label>Weight (kg)<input type="number" value={profile.weight} onChange={e=>setData(p=>({...p,profile:{...profile,weight:Number(e.target.value)}}))}/></label>
        <label>Height (cm)<input type="number" value={profile.height} onChange={e=>setData(p=>({...p,profile:{...profile,height:Number(e.target.value)}}))}/></label>
        <label>Age<input type="number" value={profile.age} onChange={e=>setData(p=>({...p,profile:{...profile,age:Number(e.target.value)}}))}/></label>
        <label>Water goal (bottles)<input type="number" min="1" max="20" value={profile.waterGoal} onChange={e=>setData(p=>({...p,profile:{...profile,waterGoal:Math.max(1,Number(e.target.value)||7)}}))}/></label>
      </div>
      <p className="muted small">One Nova bottle = 330 ml. Your water target is a flexible starting point; adjust for heat, sweat and thirst.</p>
      <button className="btn btn-dark" onClick={()=>setShowSettings(false)}>Done</button>
    </section>}

    <main className="main-content">
      {tab === 'Today' && <TodayPage
        profile={profile} today={today} protein={protein} mealProgress={mealProgress}
        setTab={setTab} setWater={setWater} toggleMeal={toggleMeal}
        checkedMealIds={checkedMealIds} waterMl={waterMl} waterGoalMl={waterGoalMl}
        exerciseList={exerciseList} checkedExercises={checkedExercises} toggleExercise={toggleExercise}
      />}
      {tab === 'Meals' && <MealsPage today={today} toggleMeal={toggleMeal} checkedMealIds={checkedMealIds}/>}
      {tab === 'Water' && <WaterPage today={today} setWater={setWater} waterMl={waterMl} waterGoalMl={waterGoalMl} goal={profile.waterGoal}/>}
      {tab === 'Workout' && <WorkoutPage workoutDay={workoutDay} setWorkoutDay={setWorkoutDay} exerciseList={exerciseList} checkedExercises={checkedExercises} toggleExercise={toggleExercise}/>}
      {tab === 'Progress' && <ProgressPage progress={progress} dayCount={dayCount} setDayCount={setDayCount} weightEntry={weightEntry} setWeightEntry={setWeightEntry} waistEntry={waistEntry} setWaistEntry={setWaistEntry} saveMeasurement={saveMeasurement} notice={notice} data={data}/>}
    </main>

    <nav className="bottom-nav">
      {nav.map(item => {
        const Icon = item.icon
        return <button key={item.id} className={`nav-item ${tab===item.id?'active':''}`} onClick={()=>setTab(item.id)}>
          <span className="nav-icon"><Icon size={20}/></span><span>{item.label}</span>
        </button>
      })}
    </nav>
  </div>
}

function PageTitle({ eyebrow, title, subtitle, right }) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{right}</div>
}
function ProgressBar({ value, color = 'blue' }) {
  return <div className={`progress-track ${color}`}><div style={{ width: `${Math.max(0,Math.min(100,value))}%` }}/></div>
}
function TodayPage({ profile, today, protein, mealProgress, setTab, setWater, toggleMeal, checkedMealIds, waterMl, waterGoalMl, exerciseList, checkedExercises, toggleExercise }) {
  const completed = checkedExercises.filter(id=>id.startsWith(exerciseList.id+'-')).length
  return <div className="page-stack">
    <section className="hero-card">
      <div className="hero-glow"/>
      <div className="hero-top"><div><span className="hero-label">YOUR DAILY RESET</span><h2>Small steps.<br/>Stronger you.</h2></div><div className="hero-icon"><Zap size={27}/></div></div>
      <p>Build your chest, fuel your workouts, and stay consistent for 30 days.</p>
      <div className="hero-stats">
        <div><span>WEIGHT</span><strong>{profile.weight} <small>kg</small></strong></div>
        <div><span>PROTEIN GOAL</span><strong>130 <small>g</small></strong></div>
        <div><span>WATER GOAL</span><strong>{profile.waterGoal} <small>bottles</small></strong></div>
      </div>
    </section>

    <section className="summary-grid">
      <button className="summary-card" onClick={()=>setTab('Meals')}>
        <div className="summary-top"><span className="summary-icon green"><Salad size={18}/></span><ChevronRight size={17}/></div>
        <strong>{checkedMealIds.length}/4</strong><span>Meals checked</span><ProgressBar value={mealProgress} color="green"/>
      </button>
      <button className="summary-card" onClick={()=>setTab('Water')}>
        <div className="summary-top"><span className="summary-icon blue"><Droplets size={18}/></span><ChevronRight size={17}/></div>
        <strong>{(waterMl/1000).toFixed(2)} <small>L</small></strong><span>Water today</span><ProgressBar value={waterMl/waterGoalMl*100}/>
      </button>
      <button className="summary-card" onClick={()=>setTab('Workout')}>
        <div className="summary-top"><span className="summary-icon orange"><Dumbbell size={18}/></span><ChevronRight size={17}/></div>
        <strong>{completed}/{exerciseList.exercises.length}</strong><span>Exercises ticked</span><ProgressBar value={completed/exerciseList.exercises.length*100} color="orange"/>
      </button>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><h3>Today's meals</h3><p>Check off each meal when you're done.</p></div><button className="text-btn" onClick={()=>setTab('Meals')}>See all <ChevronRight size={15}/></button></div>
      {meals.map(meal=><MealRow key={meal.id} meal={meal} checked={checkedMealIds.includes(meal.id)} onToggle={()=>toggleMeal(meal.id)} compact/>)}
    </section>

    <section className="water-banner" onClick={()=>setTab('Water')} role="button" tabIndex="0">
      <div className="water-banner-icon"><Droplets size={24}/></div><div className="water-banner-copy"><strong>Water check-in</strong><span>{(waterMl/1000).toFixed(2)} L of {(waterGoalMl/1000).toFixed(2)} L · Nova 330 ml</span><ProgressBar value={waterMl/waterGoalMl*100}/></div><button className="round-add" onClick={e=>{e.stopPropagation();setWater((today.water||0)+1)}} aria-label="Add a bottle">+</button>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><h3>Today's workout</h3><p>{exerciseList.title} · {exerciseList.focus}</p></div><button className="text-btn" onClick={()=>setTab('Workout')}>Open <ChevronRight size={15}/></button></div>
      {exerciseList.exercises.slice(0,3).map((ex,i)=><div className="mini-exercise" key={ex[0]}><div className="mini-index">{i+1}</div><div className="mini-copy"><strong>{ex[0]}</strong><span>{ex[1]}</span></div><CircleCheck size={19} className={checkedExercises.includes(`${exerciseList.id}-${i}`)?'checked-icon':'unchecked-icon'}/></div>)}
    </section>
    <p className="footnote">Training is a long game. Use good technique, recover well, and adjust food to your energy and progress.</p>
  </div>
}
function MealRow({ meal, checked, onToggle, compact = false }) {
  return <div className={`meal-row ${compact?'compact':''} ${checked?'meal-complete':''}`}>
    <img className="meal-thumb" src={meal.image} alt={meal.title} loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden'}}/>
    <div className="meal-info"><div className="meal-time">{meal.time}</div><strong>{meal.title}</strong><span>{meal.items.map(i=>i.amount).join(' · ')}</span><div className="meal-protein"><Zap size={13}/>{meal.protein} protein</div></div>
    <button className={`check-btn ${checked?'checked':''}`} onClick={onToggle} aria-label={`Mark ${meal.title} ${checked?'not done':'done'}`}>{checked?<Check size={19}/>:<span/>}</button>
  </div>
}
function MealsPage({ today, toggleMeal, checkedMealIds }) {
  const total = meals.reduce((s,m)=>s+(checkedMealIds.includes(m.id)?m.protein:0),0)
  return <div className="page-stack"><PageTitle eyebrow="FUEL YOUR BODY" title="Meals & protein" subtitle="Four practical meals around your 10 AM–10 PM work shift."/>
    <div className="nutrition-summary card"><div><span>Protein checked</span><strong>{total} <small>/ 130 g</small></strong></div><ProgressBar value={total/130*100} color="green"/><p>Estimates vary by product label, fish type and cooking method.</p></div>
    {meals.map(meal=><section className="meal-detail card" key={meal.id}><img src={meal.image} alt={meal.title} loading="lazy" onError={e=>{e.currentTarget.style.background='#e8edf4';e.currentTarget.style.visibility='hidden'}}/><div className="meal-detail-body"><div className="meal-detail-heading"><div><span className="meal-time">{meal.time}</span><h3>{meal.title}</h3></div><span className="protein-pill">{meal.protein} g protein</span></div><div className="food-list">{meal.items.map(item=><div className="food-item" key={item.id}><div><strong>{item.name}</strong><span>{item.amount}</span></div><b>{item.protein} g</b></div>)}</div><p className="meal-tip">{meal.tip}</p><button className={`btn ${checkedMealIds.includes(meal.id)?'btn-success':'btn-dark'}`} onClick={()=>toggleMeal(meal.id)}>{checkedMealIds.includes(meal.id)?<><Check size={16}/> Completed</>:<> <CircleCheck size={16}/> Mark meal complete</>}</button></div></section>)}
    <p className="footnote">Protein figures are estimates. For chicken and fish, use cooked weights. Oats are weighed dry.</p>
  </div>
}
function WaterPage({ today, setWater, waterMl, waterGoalMl, goal }) {
  const count = today.water || 0
  return <div className="page-stack"><PageTitle eyebrow="HYDRATION" title="Water tracker" subtitle="Track every 330 ml Nova bottle you finish."/>
    <section className="water-main card"><div className="water-circle"><div className="water-circle-inner"><Droplets size={30}/><strong>{(waterMl/1000).toFixed(2)}<small> L</small></strong><span>drunk today</span></div><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="79"/><circle className="water-ring-fill" cx="90" cy="90" r="79" style={{strokeDashoffset:496*(1-Math.min(waterMl/waterGoalMl,1))}}/></svg></div><h3>{count} of {goal} bottles</h3><p>Daily target: {(waterGoalMl/1000).toFixed(2)} litres</p><ProgressBar value={waterMl/waterGoalMl*100}/><div className="water-controls"><button className="btn btn-outline" onClick={()=>setWater(count-1)} disabled={count===0}>− Remove one</button><button className="btn btn-blue" onClick={()=>setWater(count+1)}><span className="plus">+</span> Add 330 ml</button></div><div className="water-bottle-grid">{Array.from({length:Math.min(Math.max(goal,7),14)},(_,i)=><button key={i} className={`bottle-tile ${i<count?'filled':''}`} onClick={()=>setWater(i+1)}><GlassWater size={25}/><span>Bottle {i+1}</span><small>330 ml</small>{i<count&&<Check size={14} className="bottle-check"/>}</button>)}</div></section>
    <section className="tip-card"><div className="tip-icon"><Waves size={20}/></div><div><strong>Hydration tip</strong><p>Spread water across your shift and workout. Drink more when it is hot or you sweat heavily, but don't force large amounts quickly. Follow any clinician's fluid advice if you have a medical condition affecting fluids.</p></div></section>
    <button className="btn btn-outline full" onClick={()=>{if(confirm('Reset today’s water count?'))setWater(0)}}><RotateCcw size={16}/> Reset today's water</button>
  </div>
}
function WorkoutPage({ workoutDay, setWorkoutDay, exerciseList, checkedExercises, toggleExercise }) {
  const completed = exerciseList.exercises.filter((_,i)=>checkedExercises.includes(`${exerciseList.id}-${i}`)).length
  return <div className="page-stack"><PageTitle eyebrow="TRAIN WITH PURPOSE" title="Workout plan" subtitle="Tap an exercise to mark it complete. Exercise photos are visual references; always learn safe technique."/>
    <div className="day-selector">{workouts.map(w=><button key={w.id} className={workoutDay===w.id?'selected':''} onClick={()=>setWorkoutDay(w.id)}><span>{w.short}</span><i>{w.day.slice(0,3)}</i></button>)}</div>
    <section className="workout-heading card"><div className="workout-heading-icon"><Dumbbell size={23}/></div><div><span>{exerciseList.focus}</span><h3>{exerciseList.title}</h3><p>{completed} of {exerciseList.exercises.length} exercises completed</p></div><div className="workout-percent">{Math.round(completed/exerciseList.exercises.length*100)}%</div></section>
    <ProgressBar value={completed/exerciseList.exercises.length*100} color="orange"/>
    <div className="exercise-list">{exerciseList.exercises.map((ex,i)=>{const id=`${exerciseList.id}-${i}`,done=checkedExercises.includes(id);return <article className={`exercise-card card ${done?'exercise-done':''}`} key={id}><div className="exercise-image-wrap"><img src={ex[2]} alt={ex[0]} loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden'}}/><span className="exercise-number">{String(i+1).padStart(2,'0')}</span><button className={`exercise-check ${done?'checked':''}`} onClick={()=>toggleExercise(id)} aria-label={`Mark ${ex[0]} complete`}>{done?<Check size={18}/>:<CircleCheck size={20}/>}</button></div><div className="exercise-body"><div className="exercise-title-row"><h3>{ex[0]}</h3><span className="rep-pill">{ex[1]}</span></div><p>{ex[3]}</p><div className="exercise-meta"><span><RotateCcw size={13}/> Controlled reps</span><span><Activity size={13}/> Rest 60–180 sec</span></div></div></article>})}</div>
    <div className="tip-card"><div className="tip-icon"><Target size={20}/></div><div><strong>Progressive overload</strong><p>When you can complete the top end of the rep range with good form, increase the weight slightly next time. Keep 1–3 good reps in reserve on most sets.</p></div></div>
  </div>
}
function ProgressPage({ progress, dayCount, setDayCount, weightEntry, setWeightEntry, waistEntry, setWaistEntry, saveMeasurement, notice, data }) {
  const days = data.days || {}
  const totalMealChecks = Object.values(days).reduce((n,d)=>n+(d.meals||[]).length,0)
  const totalWater = Object.values(days).reduce((n,d)=>n+(d.water||0),0)
  const totalExercises = Object.values(days).reduce((n,d)=>n+(d.exercises||[]).length,0)
  return <div className="page-stack"><PageTitle eyebrow="YOUR JOURNEY" title="Progress" subtitle="Record measurements once a week and focus on trends, not daily fluctuations."/>
    <section className="progress-hero"><div><span>30-DAY CHALLENGE</span><h3>One day at a time.</h3><p>You're building habits that last beyond this month.</p></div><div className="progress-hero-icon"><Target size={30}/></div></section>
    <div className="summary-grid three"><div className="summary-card static"><span className="summary-icon green"><Salad size={18}/></span><strong>{totalMealChecks}</strong><span>Meals checked</span></div><div className="summary-card static"><span className="summary-icon blue"><Droplets size={18}/></span><strong>{totalWater}</strong><span>Bottles logged</span></div><div className="summary-card static"><span className="summary-icon orange"><Dumbbell size={18}/></span><strong>{totalExercises}</strong><span>Exercises ticked</span></div></div>
    <section className="card measurement-card"><div className="section-heading"><div><h3>Weekly measurements</h3><p>Measure in the morning under similar conditions.</p></div><Weight size={22}/></div><div className="measurement-fields"><label>Weight (kg)<input type="number" step="0.1" value={weightEntry} onChange={e=>setWeightEntry(e.target.value)} placeholder="e.g. 65.0"/></label><label>Waist (cm)<input type="number" step="0.5" value={waistEntry} onChange={e=>setWaistEntry(e.target.value)} placeholder="e.g. 80"/></label></div><button className="btn btn-dark full" onClick={saveMeasurement}>Save today's measurements</button>{notice&&<p className="success-note">{notice}</p>}</section>
    <section className="card history-card"><h3>Measurement history</h3>{progress.length===0?<div className="empty-state"><Activity size={27}/><strong>No measurements yet</strong><span>Save your first entry above to start tracking.</span></div>:<div className="history-list">{[...progress].sort((a,b)=>b.date.localeCompare(a.date)).map(entry=><div className="history-row" key={entry.date}><div><strong>{entry.date}</strong><span>{entry.weight!=null?`Weight: ${entry.weight} kg`:'Weight not entered'}</span></div><b>{entry.waist!=null?`${entry.waist} cm waist`:'—'}</b></div>)}</div>}</section>
    <section className="tip-card"><div className="tip-icon"><Flame size={20}/></div><div><strong>What to aim for</strong><p>For this month, focus on consistent workouts, 120–140 g protein daily, enough sleep, and a gradual waist change if fat loss is appropriate. Dramatic muscle changes usually take longer than 30 days.</p></div></section>
    <button className="btn btn-outline full" onClick={()=>{if(confirm('Clear all saved app data from this device?')){localStorage.removeItem(STORAGE_KEY);location.reload()}}}><RotateCcw size={16}/> Clear all app data</button>
  </div>
}

export default App
