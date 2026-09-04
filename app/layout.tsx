import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'微光图谱｜发现你的天赋组合', description:'用 30 道情境题，探索你的十维天赋图谱与职业方向。' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
