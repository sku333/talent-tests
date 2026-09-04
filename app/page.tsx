'use client';
import { useEffect,useMemo,useRef,useState } from 'react';
import { ArrowDown,Check,Compass,Leaf,RotateCcw,Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { questions,type Key } from '@/lib/questions';

const dims=[
 ['self','自我觉察','内省','敏锐捕捉自己的情绪、动机与价值排序。','反复审视自己时，可能延迟行动。','独立判断、长期成长与价值一致的环境。',['生涯咨询','用户研究','内容策划']],
 ['people','人际洞察','共情','读懂关系中的微妙信号，让人感到被理解。','容易过度照顾他人感受，忽略自己的边界。','高协作、需要理解用户或团队氛围的场景。',['人力资源','客户成功','心理服务']],
 ['create','创造表达','创想','把零散灵感重新组合，提出有辨识度的方案。','灵感很多时，可能低估收尾所需的耐心。','允许试错、重视原创提案和快速原型的团队。',['创意策划','产品经理','独立创作者']],
 ['aesthetic','审美感知','审美','对比例、氛围、质感和视觉一致性天然敏感。','可能因追求精致，对粗糙的第一版不够宽容。','重视体验与呈现质量、能持续打磨作品的场景。',['视觉设计','品牌策划','空间陈列']],
 ['language','语言表达','语言','用准确而有感染力的语言组织观点、传递感受。','表达顺畅不等于被接收，需要留意对方语境。','需要写作、演讲、叙事或跨团队沟通的工作。',['编辑文案','教师培训','公关传播']],
 ['logic','逻辑分析','逻辑','自然寻找规律、因果与更高效的解决路径。','面对模糊情绪时，可能太快进入解决问题模式。','目标清晰、信息充分、鼓励系统推演的环境。',['数据分析','策略运营','软件开发']],
 ['space','空间想象','空间','在脑中旋转、拆解与重构空间或复杂结构。','脑内画面很清楚时，容易省略对外说明步骤。','需要结构搭建、立体呈现或流程建模的任务。',['建筑设计','工业设计','游戏关卡']],
 ['nature','自然观察','观察','对环境、生命与细微变化保持持久好奇。','容易沉浸在观察里，需要主动把发现转成输出。','接触真实世界、重视长期观察与分类研究的场景。',['生态教育','园艺景观','食品研发']],
 ['body','身体动觉','动觉','通过动作与亲身实践学习，手眼协调和现场感强。','纯文字和久坐环境可能让你的表现被低估。','允许动手验证、现场反馈快的任务。',['运动教练','手作设计','活动执行']],
 ['music','节奏音乐','节奏','对节拍、音色与情绪起伏有独特捕捉力。','感受先行时，可能难以立刻解释判断依据。','声音、节奏或情绪氛围能成为素材的场景。',['音乐制作','声音设计','视频剪辑']]
] as const;
const keys=dims.map(d=>d[0]);
const typeNames=['灵感拾穗者','旷野观察家','温暖联结者','路径推演师','感官造境人','身体实践家'];

function Radar({values}:{values:number[]}){const p=(i:number,r:number)=>`${150+Math.cos(-Math.PI/2+i*Math.PI/5)*r},${150+Math.sin(-Math.PI/2+i*Math.PI/5)*r}`;return <svg viewBox="0 0 300 300" role="img" aria-label="十项天赋维度雷达图" className="radar">{[104,78,52,26].map(r=><polygon key={r} points={dims.map((_,i)=>p(i,r)).join(' ')} fill="none"/>)}{dims.map((d,i)=>{const [x,y]=p(i,132).split(',');return <text key={d[0]} x={x} y={+y+4} textAnchor="middle">{d[2]}</text>})}<polygon className="radar-fill" points={values.map((v,i)=>p(i,104*v/100)).join(' ')}/>{values.map((v,i)=>{const[x,y]=p(i,104*v/100).split(',');return <circle key={i} cx={x} cy={y} r="3"/>})}</svg>}

export default function Home(){
 const [stage,setStage]=useState<'home'|'quiz'|'result'>('home'),[active,setActive]=useState(0),[answers,setAnswers]=useState<number[]>([]);
 const sections=useRef<(HTMLElement|null)[]>([]),startedAt=useRef(Date.now()),identity=useRef({id:'',source:'direct'});
 const track=(eventName:string)=>{if(identity.current.id)void fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({anonymousId:identity.current.id,eventName,source:identity.current.source}),keepalive:true})};
 useEffect(()=>{let id=localStorage.getItem('weiguang_anonymous_id');if(!id){id=crypto.randomUUID();localStorage.setItem('weiguang_anonymous_id',id)}identity.current={id,source:new URLSearchParams(location.search).get('source')?.slice(0,80)||'direct'};track('page_view')},[]);
 const scores=useMemo(()=>{const raw=Object.fromEntries(keys.map(k=>[k,0])) as Record<Key,number>;answers.forEach((a,i)=>{if(a===undefined)return;Object.entries(questions[i].options[a].scores).forEach(([k,v])=>raw[k as Key]+=v||0)});const max=Math.max(...Object.values(raw),1);return dims.map(d=>Math.round(42+raw[d[0]]/max*54))},[answers]);
 const ranked=dims.map((d,i)=>({d,score:scores[i]})).sort((a,b)=>b.score-a.score),top=ranked.slice(0,3),type=typeNames[(keys.indexOf(top[0].d[0])+keys.indexOf(top[1].d[0]))%typeNames.length];
 const start=()=>{startedAt.current=Date.now();track('test_start');setStage('quiz');setTimeout(()=>scrollTo({top:0}),0)};
 const choose=(q:number,a:number)=>{const next=[...answers];next[q]=a;setAnswers(next);if([9,19,29].includes(q))track(`progress_${q+1}`);if(q===29){setTimeout(()=>setStage('result'),520);return}setActive(q+1);setTimeout(()=>sections.current[q+1]?.scrollIntoView({behavior:'smooth',block:'start'}),260)};
 const restart=()=>{track('restart_test');setAnswers([]);setActive(0);startedAt.current=Date.now();setStage('quiz');scrollTo({top:0})};
 useEffect(()=>{if(stage!=='result'||!identity.current.id)return;track('test_complete');track('report_view');void fetch('/api/result',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({anonymousId:identity.current.id,typeName:type,top:top.map(x=>x.d[1]),scores,durationSeconds:Math.round((Date.now()-startedAt.current)/1000)})})},[stage]);

 if(stage==='home')return <main className="shell autumn"><nav><div className="brand"><span className="brand-mark"><Leaf/></span>拾光天赋</div><span className="nav-note">一封写给自己的秋日回信</span></nav><section className="hero"><div className="eyebrow"><Sparkles/>30 个生活片段 · 约 6 分钟</div><h1>那些做起来<br/><em>毫不费力的事，</em><br/>藏着你的天赋。</h1><p className="lead">不是替你决定该做什么，而是从真实的选择里，拾起十种能力留下的线索。</p><Button onClick={start} className="primary-cta">开始拾取我的线索 <ArrowDown/></Button><p className="privacy"><Check/>无需登录 · 仅记录匿名进度与结果摘要</p><div className="sun-print"><span>10</span><p>TALENT<br/>CLUES</p>{['观察','表达','创造','感知'].map((x,i)=><i key={x} className={`seed s${i}`}>{x}</i>)}</div></section><footer>用于自我探索与娱乐参考，不构成科学诊断或职业结果保证。</footer></main>;

 if(stage==='quiz')return <main className="quiz-scroll"><header className="quiz-nav"><button onClick={()=>setStage('home')}>退出</button><div className="brand small"><span className="brand-mark"><Leaf/></span>拾光天赋</div><span>{Math.min(active+1,30)} / 30</span><div className="progress"><i style={{width:`${(active+1)/30*100}%`}}/></div></header><div className="question-stream">{questions.map((q,qi)=><section key={qi} ref={el=>{sections.current[qi]=el}} className={`question-panel ${qi===active?'is-active':''} ${answers[qi]!==undefined?'is-answered':''}`}><div className="question-inner"><p className="scene">{String(qi+1).padStart(2,'0')} · {q.scene}</p><h2>{q.title}</h2><p className="hint">凭第一反应选择，没有标准答案</p><div className="options">{q.options.map((o,oi)=><button key={oi} disabled={qi>active} className={answers[qi]===oi?'selected':''} onClick={()=>choose(qi,oi)}><span>{String.fromCharCode(65+oi)}</span><b>{o.text}</b><Check/></button>)}</div>{qi<29&&answers[qi]!==undefined&&<p className="continue"><ArrowDown/>下一段正在展开</p>}</div></section>)}</div></main>;

 return <main className="result-page autumn"><nav><div className="brand small"><span className="brand-mark"><Leaf/></span>拾光天赋</div><button className="restart" onClick={restart}><RotateCcw/>重新测试</button></nav><header className="result-hero"><p className="eyebrow">YOUR AUTUMN TALENT MAP</p><h1>你是<br/><em>「{type}」</em></h1><p>你的力量来自 <b>{top[0].d[1]}</b>、<b>{top[1].d[1]}</b> 与 <b>{top[2].d[1]}</b> 的相遇。它们不是职业标签，而是你在不同道路上都可以带走的能力。</p><div className="top-three">{top.map((x,i)=><article key={x.d[0]}><span>核心线索 {i+1}</span><b>{x.d[1]}</b><strong>{x.score}</strong></article>)}</div></header><section className="report"><div className="chart-card"><p className="section-kicker">能力全景</p><h2>十维天赋图谱</h2><Radar values={scores}/><div className="score-list">{dims.map((d,i)=><div key={d[0]}><span>{d[1]}</span><i><b style={{width:`${scores[i]}%`}}/></i><strong>{scores[i]}</strong></div>)}</div></div><div className="insight"><p className="section-kicker">你的第一驱动力</p><h2>{top[0].d[1]}</h2><p>{top[0].d[3]} 当它与{top[1].d[1]}结合，你往往能把别人忽略的线索，变成可理解、可行动的方向。</p><div className="mini"><span>容易忽略的地方</span><p>{top[0].d[4]}</p></div><div className="mini"><span>更容易发光的场景</span><p>{top[0].d[5]}</p></div></div><div className="career"><p className="section-kicker">把职业当作实验</p><h2>值得优先靠近的方向</h2><div className="career-tags">{Array.from(new Set(top.flatMap(x=>x.d[6]))).slice(0,6).map(j=><span key={j}>{j}</span>)}</div><p className="note">职业选择还需结合兴趣、技能、价值观、现实机会与生活阶段。</p></div><div className="action"><p className="section-kicker">未来 7 天</p><h2>为天赋留下一枚证据</h2><ol><li><b>记下自然时刻</b><span>每天记录一件做起来不费力的事。</span></li><li><b>做一次小实验</b><span>从推荐方向里选择一个，体验 30 分钟。</span></li><li><b>邀请他人观察</b><span>问两个人：我做什么时最有生命力？</span></li></ol></div></section><footer className="result-footer"><p>天赋不是答案，是你走路时自然留下的纹理。</p><button onClick={()=>setStage('home')}>回到首页</button></footer></main>;
}
