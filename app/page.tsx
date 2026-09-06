'use client';
import { useEffect,useMemo,useRef,useState } from 'react';
import { ArrowDown,Briefcase,Check,Compass,Heart,Leaf,Lightbulb,Map,RotateCcw,Sparkles,Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { questions,type Key } from '@/lib/questions';

const API_BASE='https://talent-tests-d5gk2ui6g78f773d0-1472636073.ap-shanghai.app.tcloudbase.com/api';

const dims=[
 ['self','内省','内省','敏锐捕捉自己的情绪、动机与价值排序。','反复审视自己时，可能延迟行动。','独立判断、长期成长与价值一致的环境。',['生涯咨询','用户研究','内容策划']],
 ['people','人际','人际','读懂关系中的微妙信号，让人感到被理解。','容易过度照顾他人感受，忽略自己的边界。','高协作、需要理解用户或团队氛围的场景。',['人力资源','客户成功','心理服务']],
 ['create','创造','创造','生成、筛选并改进新想法，把零散线索组合成有效方案。','灵感很多时，可能低估收尾所需的耐心。','允许试错、重视原创提案和快速原型的团队。',['创意策划','产品经理','独立创作者']],
 ['aesthetic','美学','美学','对比例、氛围、质感和视觉一致性天然敏感。','可能因追求精致，对粗糙的第一版不够宽容。','重视体验与呈现质量、能持续打磨作品的场景。',['视觉设计','品牌策划','空间陈列']],
 ['language','语言','语言','用准确而有感染力的语言组织观点、传递感受。','表达顺畅不等于被接收，需要留意对方语境。','需要写作、演讲、叙事或跨团队沟通的工作。',['编辑文案','教师培训','公关传播']],
 ['logic','逻辑算法','逻辑','自然寻找规律、因果与更高效的解决路径。','面对模糊情绪时，可能太快进入解决问题模式。','目标清晰、信息充分、鼓励系统推演的环境。',['数据分析','策略运营','软件开发']],
 ['space','空间想象','空间','在脑中旋转、拆解与重构空间或复杂结构。','脑内画面很清楚时，容易省略对外说明步骤。','需要结构搭建、立体呈现或流程建模的任务。',['建筑设计','工业设计','游戏关卡']],
 ['nature','自然','自然','对环境、生命与细微变化保持持久好奇。','容易沉浸在观察里，需要主动把发现转成输出。','接触真实世界、重视长期观察与分类研究的场景。',['生态教育','园艺景观','食品研发']],
 ['body','身体-动觉','动觉','通过动作与亲身实践学习，手眼协调和现场感强。','纯文字和久坐环境可能让你的表现被低估。','允许动手验证、现场反馈快的任务。',['运动教练','手作设计','活动执行']],
 ['music','音乐','音乐','对节拍、音色与情绪起伏有独特捕捉力。','感受先行时，可能难以立刻解释判断依据。','声音、节奏或情绪氛围能成为素材的场景。',['音乐制作','声音设计','视频剪辑']]
] as const;
const keys=dims.map(d=>d[0]);
const dimensionMax=Object.fromEntries(keys.map(key=>[key,questions.reduce((sum,q)=>sum+Math.max(...q.options.map(option=>option.scores[key]||0)),0)])) as Record<Key,number>;
const personas:Record<Key,[string,string]>={self:['内在罗盘型','先听见自己，再选择值得走的路'],people:['关系共振型','从人与人的细微信号里找到答案'],create:['可能性发明型','本能地为旧问题打开一扇新门'],aesthetic:['感官造境型','让混乱获得质感、秩序与气氛'],language:['叙事点灯型','用语言照亮经验，也让他人看见'],logic:['系统解题型','把复杂世界拆成可以推进的路径'],space:['空间构筑型','先在脑中看见结构，再让它落地'],nature:['万物观察型','在真实世界的变化里发现规律'],body:['行动校准型','用双手、身体与现场反馈认识世界'],music:['节奏感应型','对声音、情绪和时间的起伏格外敏锐']};
const development:Record<Key,[string,string,string]>={self:['需要独立判断、深度思考的任务','从复盘与咨询类小项目积累案例','决策框架与自我管理能力'],people:['高互动、能持续获得人际反馈的任务','从访谈、社群或服务体验开始','信任建立与关系协调能力'],create:['目标明确但路径开放的创新任务','每周完成一个可展示的小原型','创意方法与作品组合'],aesthetic:['重视体验、允许反复打磨的任务','建立视觉观察库并做一次改造','风格判断与品质控制能力'],language:['需要写作、讲述或知识转译的任务','持续发布短文、讲解或采访作品','内容资产与表达影响力'],logic:['问题清晰、可验证迭代的任务','用真实数据完成一次分析项目','模型思维与自动化能力'],space:['涉及结构、布局或立体呈现的任务','完成一次空间、流程或信息建模','可视化与系统搭建能力'],nature:['接触真实环境、允许长期观察的任务','做一份连续七天的观察记录','分类研究与现场洞察能力'],body:['能动手、反馈快、少久坐的任务','报名一次实践课或参与现场执行','操作经验与即时判断能力'],music:['声音、节奏或情绪可成为材料的任务','完成一段声音、剪辑或节奏练习','听觉素材库与节奏控制能力']};
const reportIcons=[Compass,Lightbulb,Map,Heart,Target,Briefcase];
const workplaceRoles:Record<Key,[string,string]>={
 self:['方向校准者','在重要选择前梳理动机、价值与取舍，帮助团队找到值得持续投入的方向。'],
 people:['团队连接者','理解不同人的需要，协调关系与期待，让协作中的信息和信任流动起来。'],
 create:['创意开拓者','为停滞的问题提出新可能，通过小规模试验把想法变成可讨论的方案。'],
 aesthetic:['体验打磨者','关注细节与整体的一致性，把功能、视觉与氛围整理成舒服的体验。'],
 language:['价值表达者','把复杂信息讲清楚，让观点被理解，也让团队的成果被看见。'],
 logic:['系统解题者','拆解问题、梳理因果，用可验证的步骤推进决策与执行。'],
 space:['结构搭建者','看见部分之间的关系，把抽象构想转成清晰的结构、布局与模型。'],
 nature:['现场观察者','持续观察真实情境中的变化，从细节中发现值得验证的线索。'],
 body:['实践推进者','在现场行动中快速获得反馈，把计划落实成具体、可用的成果。'],
 music:['节奏塑造者','通过声音与节奏组织体验，捕捉内容的情绪变化与表达时机。']
};

function Radar({values}:{values:number[]}){const p=(i:number,r:number)=>`${150+Math.cos(-Math.PI/2+i*Math.PI/5)*r},${150+Math.sin(-Math.PI/2+i*Math.PI/5)*r}`;return <svg viewBox="0 0 300 300" role="img" aria-label="十项天赋维度雷达图" className="radar">{[104,78,52,26].map(r=><polygon key={r} points={dims.map((_,i)=>p(i,r)).join(' ')} fill="none"/>)}{dims.map((d,i)=>{const [x,y]=p(i,132).split(',');return <text key={d[0]} x={x} y={+y+4} textAnchor="middle">{d[2]}</text>})}<polygon className="radar-fill" points={values.map((v,i)=>p(i,104*v/100)).join(' ')}/>{values.map((v,i)=>{const[x,y]=p(i,104*v/100).split(',');return <circle key={i} cx={x} cy={y} r="3"/>})}</svg>}

export default function Home(){
 const [stage,setStage]=useState<'home'|'quiz'|'result'>('home'),[active,setActive]=useState(0),[answers,setAnswers]=useState<number[]>([]);
 const sections=useRef<(HTMLElement|null)[]>([]),startedAt=useRef(Date.now()),identity=useRef({id:'',source:'direct'});
 const track=(eventName:string)=>{if(identity.current.id)void fetch(`${API_BASE}/track`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({anonymousId:identity.current.id,eventName,source:identity.current.source}),keepalive:true})};
 useEffect(()=>{let id=localStorage.getItem('weiguang_anonymous_id');if(!id){id=crypto.randomUUID();localStorage.setItem('weiguang_anonymous_id',id)}identity.current={id,source:new URLSearchParams(location.search).get('source')?.slice(0,80)||'direct'};track('page_view')},[]);
 const scores=useMemo(()=>{const raw=Object.fromEntries(keys.map(k=>[k,0])) as Record<Key,number>;answers.forEach((a,i)=>{if(a===undefined)return;Object.entries(questions[i].options[a].scores).forEach(([k,v])=>raw[k as Key]+=v||0)});return dims.map(d=>Math.round(35+raw[d[0]]/dimensionMax[d[0]]*65))},[answers]);
 const ranked=dims.map((d,i)=>({d,score:scores[i]})).sort((a,b)=>b.score-a.score),top=ranked.slice(0,3),low=ranked.slice(-2).reverse(),baseType=personas[top[0].d[0]][0],type=baseType,path=development[top[0].d[0]],careerDirections=top.flatMap(x=>x.d[6].map(name=>({name,dimension:x.d[1],reason:x.d[3]}))),priorityCareers=top.map(x=>({name:x.d[6][0],dimension:x.d[1],reason:x.d[3]})),role=workplaceRoles[top[0].d[0]];
 const start=()=>{startedAt.current=Date.now();track('test_start');setStage('quiz');setTimeout(()=>scrollTo({top:0}),0)};
 const choose=(q:number,a:number)=>{const next=[...answers];next[q]=a;setAnswers(next);if([9,19,29].includes(q))track(`progress_${q+1}`);if(q===29){setTimeout(()=>{setStage('result');scrollTo({top:0,behavior:'instant'})},520);return}setActive(q+1);setTimeout(()=>sections.current[q+1]?.scrollIntoView({behavior:'smooth',block:'start'}),260)};
 const restart=()=>{track('restart_test');setAnswers([]);setActive(0);startedAt.current=Date.now();setStage('quiz');scrollTo({top:0})};
 useEffect(()=>{if(stage!=='result'||!identity.current.id)return;track('test_complete');track('report_view');void fetch(`${API_BASE}/result`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({anonymousId:identity.current.id,typeName:type,top:top.map(x=>x.d[1]),scores,durationSeconds:Math.round((Date.now()-startedAt.current)/1000)})})},[stage]);

 if(stage==='home')return <main className="shell autumn"><section className="hero hero-clean"><div className="eyebrow"><Sparkles/>30 个真实情境 · 十维天赋探索 · 约 6 分钟</div><h1>灵魂的欲望<br/>是命运的先知</h1><p className="lead">有些事情让你迅速进入状态，有些能力即使没有被提醒，也会自然出现。沿着这些真实反应，发现你更容易发光的工作方式与发展方向。</p><p className="manifesto">别再只用不擅长的方式证明自己。</p><Button onClick={start} className="primary-cta">开启我的天赋图谱 <ArrowDown/></Button><div className="talent-ribbon">{dims.map(d=><span key={d[0]}>{d[1]}</span>)}</div><div className="sun-print"><span>10</span><p>TALENT<br/>INSTINCTS</p>{['感知','优势','职业','方向'].map((x,i)=><i key={x} className={`seed s${i}`}>{x}</i>)}</div></section><footer>本测试用于自我探索与娱乐参考，不构成心理测量、科学诊断或职业结果保证。</footer></main>;

 if(stage==='quiz')return <main className="quiz-scroll"><header className="quiz-nav"><button onClick={()=>setStage('home')}>退出</button><div className="brand small"><span className="brand-mark"><Leaf/></span>拾光天赋</div><span>{Math.min(active+1,30)} / 30</span><div className="progress"><i style={{width:`${(active+1)/30*100}%`}}/></div></header><div className="question-stream">{questions.map((q,qi)=><section key={qi} ref={el=>{sections.current[qi]=el}} className={`question-panel ${qi===active?'is-active':''} ${answers[qi]!==undefined?'is-answered':''}`}><div className="question-inner"><p className="scene">{String(qi+1).padStart(2,'0')} · {q.scene}</p><h2>{q.title}</h2><p className="hint">凭第一反应选择，没有标准答案</p><div className="options">{q.options.map((o,oi)=><button key={oi} disabled={qi>active} className={answers[qi]===oi?'selected':''} onClick={()=>choose(qi,oi)}><span>{String.fromCharCode(65+oi)}</span><b>{o.text}</b><Check/></button>)}</div>{qi<29&&answers[qi]!==undefined&&<p className="continue"><ArrowDown/>下一段正在展开</p>}</div></section>)}</div></main>;

 return <main className="result-page autumn">
  <nav aria-label="报告操作"><div className="brand small"><span className="brand-mark"><Leaf/></span>拾光天赋</div><button className="restart" onClick={restart}><RotateCcw/>重新测试</button></nav>
  <div className="report-container">
   <section className="report-layer overview-layer" aria-labelledby="identity-title">
    <header className="result-hero reveal-section"><p className="part">01 / 认识你的天赋</p><p className="eyebrow">YOUR TALENT ARCHETYPE</p><h1 id="identity-title"><span>你的天赋人格</span><em>{type}</em></h1><p className="persona-line">{personas[top[0].d[0]][1]}</p><p>你的优势链由 <b>{top[0].d[1]}</b> 发起，借助 <b>{top[1].d[1]}</b> 推进，再由 <b>{top[2].d[1]}</b> 放大。它不是唯一职业答案，而是一组可以迁移到不同领域的能力组合。</p></header>
    <section className="chapter priority-section" aria-labelledby="priority-title"><div className="section-heading"><p className="part">优先职业方向</p><h2 id="priority-title">先从这三个方向探索</h2></div><div className="priority-grid">{priorityCareers.map((career,i)=><article key={career.name}><span className="card-index">0{i+1}</span><p className="card-label">{career.dimension}驱动</p><h3>{career.name}</h3><p>{career.reason}</p></article>)}</div></section>
    <section className="role-card"><div className="role-symbol"><Briefcase/></div><div><p className="part">你在职场中的角色</p><h2>{role[0]}</h2><p>{role[1]}</p></div></section>
   </section>
   <section className="report-layer" aria-labelledby="strength-title">
    <header className="layer-heading"><p className="part">02 / 理解你的优势</p><h2 id="strength-title">看见天赋如何一起工作</h2></header>
    <section className="chapter reveal-section"><p className="part">TOP 3 · 核心天赋</p><h3>三种力量，构成你的独特工作方式</h3><div className="top-three">{top.map((x,i)=><article key={x.d[0]}><span>核心天赋 {i+1}</span><div className="talent-score"><b>{x.d[1]}</b><strong>{x.score}<small>/ 100</small></strong></div><p>{x.d[3]}</p></article>)}</div></section>
    <section className="chapter reveal-section"><p className="part">天赋组合</p><h3>{top[0].d[1]}负责启动，{top[1].d[1]}帮助推进</h3><p className="chapter-lead">当{top[2].d[1]}加入后，你不只是“擅长一件事”，而是更容易形成一条完整的优势链：发现重要线索、选择自然的处理方式，再把它转化为别人能够感受到的成果。</p><div className="combo-flow">{top.map((x,i)=><article key={x.d[0]}><span>0{i+1}</span><b>{x.d[1]}</b><small>{i===0?'启动与判断':i===1?'推进与连接':'呈现与放大'}</small></article>)}</div></section>
    <section className="chapter reveal-section"><p className="part">能力全景</p><h3>你的十维天赋图谱</h3><div className="chart-layout"><Radar values={scores}/><div className="score-list">{dims.map((d,i)=><div key={d[0]}><span>{d[1]}</span><i><b style={{width:(scores[i]+'%')}}/></i><strong>{scores[i]}</strong></div>)}</div></div></section>
    <section className="chapter reveal-section"><p className="part">十维详解</p><h3>不只看排名，也看你如何使用它</h3><div className="detail-grid">{ranked.map(x=><article key={x.d[0]}><header><h4>{x.d[1]}</h4><strong>{x.score}</strong></header><p>{x.d[3]}</p></article>)}</div></section>
    <section className="chapter reveal-section"><p className="part">优势与盲点</p><h3>用好第一驱动力，也保护自己的边界</h3><div className="strength-grid"><article><Sparkles/><h4>自然优势</h4><p>{top[0].d[3]} 当它与{top[1].d[1]}结合，你更容易把零散线索变成可以推进的方向。</p></article><article><Target/><h4>潜在盲点</h4><p>{top[0].d[4]}</p></article></div></section>
   </section>
   <section className="report-layer" aria-labelledby="growth-title">
    <header className="layer-heading"><p className="part">03 / 找到适合你的路</p><h2 id="growth-title">把天赋带进真实的工作</h2></header>
    <section className="chapter reveal-section"><p className="part">工作任务</p><h3>从做起来更自然的事情开始</h3><div className="task-list">{top.map((x,i)=><article key={x.d[0]}><span className="card-index">0{i+1}</span><div><h4>{development[x.d[0]][0]}</h4><p>{development[x.d[0]][1]}</p></div></article>)}</div></section>
    <section className="chapter reveal-section"><p className="part">工作环境</p><h3>有些环境让你发光，有些只是让你更费力</h3><div className="strength-grid"><article><Heart/><h4>更容易发光</h4><p>{top[0].d[5]}</p></article><article><Compass/><h4>隐性消耗</h4><p>你的{low[0].d[1]}与{low[1].d[1]}在本次回答中相对靠后。长期只依赖这些方式工作可能更费力，可以通过团队互补、工具和流程降低消耗。</p></article></div></section>
    <section className="chapter reveal-section"><p className="part">详细职业方向</p><h3>先选择工作内容，再选择职业名称</h3><div className="career-cards">{careerDirections.map((career,i)=>{const Icon=reportIcons[i%reportIcons.length];return <article key={career.name}><Icon/><div><span>{career.dimension}驱动</span><h4>{career.name}</h4><p>{career.reason}</p><small>入门验证：找一个真实小任务，连续体验三次，再判断是否值得投入。</small></div></article>})}</div><p className="note">推荐方向不是录取通知书。还需要结合兴趣、技能、价值观、现实机会与生活阶段判断。</p></section>
    <section className="chapter reveal-section"><p className="part">职场发展层级</p><h3>从做好一件事，到带动更多人</h3><div className="road-grid levels"><article><span>01 · 独立完成</span><h4>把天赋练成可靠技能</h4><p>从{priorityCareers[0].name}相关的小任务开始，练习独立交付，并根据反馈改进。</p></article><article><span>02 · 协作负责</span><h4>把个人优势带进项目</h4><p>发挥{role[0]}的作用，说明自己的判断方法，协调协作伙伴，负责完整项目。</p></article><article><span>03 · 专业引领</span><h4>让经验帮助更多人</h4><p>沉淀{path[2]}，通过方法、作品或带教扩大影响，选择适合自己的专业或管理路径。</p></article></div><p className="note">这是能力积累的参考顺序，不代表你当前的职级，也不预设晋升速度。</p></section>
    <section className="chapter reveal-section"><p className="part">职业发展路线</p><h3>让天赋从感受，长成别人看得见的能力</h3><div className="road-grid"><article><span>优先寻找</span><b>{path[0]}</b></article><article><span>起步验证</span><b>{path[1]}</b></article><article><span>长期积累</span><b>{path[2]}</b></article></div></section>
    <section className="blessing reveal-section"><p className="part">写给你</p><Heart/><h2>愿你找到与灵魂契合的方向</h2><p>愿你不必成为别人眼中正确的人，而能慢慢靠近那个让自己感到舒展、笃定并充满生命力的方向。愿你的天赋被看见，热爱有处安放，付出的努力最终长成属于你的成功。</p><blockquote>你要寻找的，或许不是最喧闹的那条路，而是灵魂走上去以后，不再需要反复说服自己的那一条。</blockquote><button onClick={()=>{setStage('home');scrollTo({top:0,behavior:'instant'})}}>回到首页</button></section>
   </section>
  </div>
 </main>;
}
