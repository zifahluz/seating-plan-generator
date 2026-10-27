/* Pure seating constraint solver; also usable from Node tests. */
(function(root){
'use strict';
function adjacent(a,b,cols){return Math.floor(a/cols)===Math.floor(b/cols)&&Math.abs(a-b)===1 || Math.abs(a-b)===cols;}
function validate(p){
 const {students,rows,cols,locks,pairs,seats}=p, errors=[]; const ids=new Set(students.map(s=>s.id));
 if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<1||cols<1||rows>12||cols>12) errors.push('Rows and columns must each be between 1 and 12.');
 if(ids.size!==students.length) errors.push('Student IDs must be unique.');
 if(students.length>rows*cols) errors.push('There are more students than seats.');
 const used=new Set();
 for(const [seat,id] of Object.entries(locks||{})){const n=Number(seat); if(!Number.isInteger(n)||n<0||n>=rows*cols||!ids.has(id)||used.has(id)) errors.push('A locked seat is invalid or a student is locked more than once.'); used.add(id);}
 for(const pair of pairs||[]) if(!Array.isArray(pair)||pair.length!==2||pair[0]===pair[1]||!ids.has(pair[0])||!ids.has(pair[1])) errors.push('A separation pair is invalid.');
 if(seats){if(!Array.isArray(seats)||seats.length!==rows*cols) errors.push('The seating plan has the wrong number of seats.'); else {const occupied=seats.filter(Boolean); if(new Set(occupied).size!==occupied.length||occupied.some(id=>!ids.has(id))||occupied.length!==students.length) errors.push('The seating plan must contain each student exactly once.'); for(const [s,id] of Object.entries(locks||{})) if(seats[Number(s)]!==id) errors.push('A locked student is not in their locked seat.'); for(const [a,b] of pairs||[]){let x=seats.indexOf(a),y=seats.indexOf(b); if(x>=0&&y>=0&&adjacent(x,y,cols)) errors.push('A separation pair is adjacent.');}}}
 return errors;
}
function solve(p, options={}){
 const errors=validate(p); if(errors.length)return {status:'invalid',errors};
 const {students,rows,cols,locks={},pairs=[]}=p, size=rows*cols, result=Array(size).fill(null), forbidden=new Map(students.map(s=>[s.id,new Set()]));
 for(const [a,b] of pairs){forbidden.get(a).add(b);forbidden.get(b).add(a);}
 for(const [s,id] of Object.entries(locks)) result[Number(s)]=id;
 const locked=Object.entries(locks); for(let i=0;i<locked.length;i++)for(let j=0;j<i;j++)if(adjacent(+locked[i][0],+locked[j][0],cols)&&forbidden.get(locked[i][1]).has(locked[j][1]))return {status:'impossible',reason:'Two locked students who must be separated are adjacent.'};
 const remaining=students.map(s=>s.id).filter(id=>!result.includes(id));
 const random=options.random||Math.random, maxNodes=options.maxNodes??300000, deadline=Date.now()+(options.timeLimitMs??2500); let nodes=0, stopped=false;
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function allowed(id,s){for(let i=0;i<size;i++)if(result[i]&&adjacent(s,i,cols)&&forbidden.get(id).has(result[i]))return false;return true;}
 function search(left){if(!left.length)return true;if(++nodes>maxNodes||Date.now()>deadline){stopped=true;return false;}
 // Choose the student with fewest available seats, favouring constrained students.
 let best=null, spots=null; for(const id of left){const candidates=[];for(let s=0;s<size;s++)if(!result[s]&&allowed(id,s))candidates.push(s); if(!candidates.length)return false;if(!spots||candidates.length<spots.length||(candidates.length===spots.length&&forbidden.get(id).size>forbidden.get(best).size)){best=id;spots=candidates;}}
 const next=left.filter(id=>id!==best);for(const s of shuffle(spots)){result[s]=best;if(search(next))return true;result[s]=null;if(stopped)return false;}return false;}
 if(search(shuffle(remaining)))return {status:'success',seats:result};
 return stopped?{status:'limit',reason:'The search reached its time or complexity limit. This does not prove the constraints are impossible; simplify them and try again.'}:{status:'impossible',reason:'No seating arrangement satisfies all locks and separation pairs.'};
}
const api={adjacent,validate,solve};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeatingSolver=api;
})(typeof window!=='undefined'?window:globalThis);
