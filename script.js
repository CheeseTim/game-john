// Acronym Fill — game logic
const $ = id => document.getElementById(id);
let acronyms = null;
let acronymsCompTIA = null;
let acronymsBrainrot = null;
let currentDataset = 'comptia'; // 'comptia' or 'brainrot'
let current = null;
let score = parseInt(localStorage.getItem('af_score')||'0',10) || 0;
$('score').textContent = score;

async function loadAcronyms(){
  try{
    const [r1, r2] = await Promise.all([
      fetch('data/acronyms.json'),
      fetch('data/brainrot.json')
    ]);
    acronymsCompTIA = await r1.json();
    acronymsBrainrot = await r2.json();
    acronyms = currentDataset === 'brainrot' ? acronymsBrainrot : acronymsCompTIA;
  }catch(e){
    // fallback if fetch fails
    acronymsCompTIA = [
      {acronym:'CPU',expansion:'Central Processing Unit'},
      {acronym:'RAM',expansion:'Random Access Memory'},
      {acronym:'BIOS',expansion:'Basic Input/Output System'}
    ];
    acronymsBrainrot = [
      {acronym:'BRN',expansion:'Tim Cheese and John Pork'},
      {acronym:'TRL',expansion:'Tralalero Tralala Song'}
    ];
    acronyms = currentDataset === 'brainrot' ? acronymsBrainrot : acronymsCompTIA;
  }
}

function pickRandom(){
  if(!acronyms || !acronyms.length) return null;
  const idx = Math.floor(Math.random()*acronyms.length);
  return JSON.parse(JSON.stringify(acronyms[idx]));
}

function chooseHiddenWord(expansion){
  const stop = new Set(['of','the','and','a','an','to','in','on','for','with','by','is','as','or']);
  const words = expansion.split(/\s+/);
  const candidates = words.map((w,i)=>({w:w.replace(/[.,\/()]/g,'').trim(), i})).filter(o=>o.w.length>2 && !stop.has(o.w.toLowerCase()));
  if(!candidates.length) return null;
  const pick = candidates[Math.floor(Math.random()*candidates.length)];
  return pick;
}

function switchDataset(){
  if(currentDataset === 'comptia'){
    currentDataset = 'brainrot';
    acronyms = acronymsBrainrot || acronymsCompTIA;
  }else{
    currentDataset = 'comptia';
    acronyms = acronymsCompTIA || acronymsBrainrot;
  }
  const btn = $('toggle-mode'); if(btn) btn.textContent = currentDataset === 'comptia' ? 'Brainrot Mode' : 'CompTIA Mode';
  const ind = $('mode-indicator'); if(ind) ind.textContent = currentDataset === 'comptia' ? 'CompTIA' : 'Brainrot';
  const subtitle = $('subtitle'); if(subtitle) subtitle.textContent = currentDataset === 'comptia' ? 'CompTIA A+ (1201) practice — fill the missing word' : 'Brainrot mode — fill the missing word';
  renderRound();
}

function renderRound(){
  current = pickRandom();
  if(!current){
    $('acronym').textContent = '—';
    $('expansion').textContent = 'No acronyms available.';
    return;
  }
  const hidden = chooseHiddenWord(current.expansion);
  current.hidden = hidden;
  $('acronym').textContent = current.acronym;

  if(hidden){
    const parts = current.expansion.split(/(\s+)/);
    // replace the word at the correct index (approximate by matching first occurrence)
    let replaced=false;
    for(let i=0;i<parts.length;i++){
      if(parts[i].trim().toLowerCase()===hidden.w.toLowerCase() && !replaced){
        parts[i] = '______'; replaced=true; break;
      }
    }
    $('expansion').textContent = parts.join('');
  }else{
    $('expansion').textContent = current.expansion;
  }
  $('answer').value='';
  $('result').textContent='';
  $('answer').focus();
}

function normalize(s){return s.trim().toLowerCase();}

function checkAnswer(){
  const input = $('answer').value;
  if(!current || !current.hidden){
    $('result').textContent='No missing word to check.';
    return;
  }
  if(!input.trim()){
    $('result').textContent='Please type your answer.'; $('result').className='result failure'; return;
  }
  if(normalize(input)===normalize(current.hidden.w)){
    $('result').textContent='Correct ✅'; $('result').className='result success';
    score += 1; localStorage.setItem('af_score',score); $('score').textContent = score;
  }else{
    $('result').textContent=`Not quite — try again or Show Answer.`; $('result').className='result failure';
  }
}

function showAnswer(){
  if(!current || !current.hidden) return;
  $('result').textContent = `Answer: ${current.hidden.w}`; $('result').className='result';
}

function nextRound(){
  renderRound();
}

// wire up
document.addEventListener('DOMContentLoaded', async ()=>{
  await loadAcronyms();
  renderRound();

  $('check').addEventListener('click', checkAnswer);
  $('skip').addEventListener('click', ()=>{ score = Math.max(0,score-1); localStorage.setItem('af_score',score); $('score').textContent = score; nextRound(); });
  $('show').addEventListener('click', showAnswer);
  $('next').addEventListener('click', nextRound);
  $('answer').addEventListener('keydown', e=>{ if(e.key==='Enter') checkAnswer(); });

  const toggle = $('toggle-mode'); if(toggle) toggle.addEventListener('click', switchDataset);
  // initialize mode label/button
  const btn = $('toggle-mode'); if(btn) btn.textContent = currentDataset === 'comptia' ? 'Brainrot Mode' : 'CompTIA Mode';
  const ind = $('mode-indicator'); if(ind) ind.textContent = currentDataset === 'comptia' ? 'CompTIA' : 'Brainrot';
});
