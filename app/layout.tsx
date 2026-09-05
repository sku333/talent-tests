import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'拾光天赋｜灵魂的欲望是命运的先知', description:'从童年偏好与真实情境中，探索十维天赋人格、职业方向与发展路径。' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
