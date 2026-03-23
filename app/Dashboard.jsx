"use client";
import { useState, useEffect, useRef } from "react";
import { loadData, saveData, resetAllData } from "../lib/supabase";
const NAVY="#1B2A45",BLUE="#2B5EA7",STEEL="#4F7896",GOLD="#D4A843",DARK="#0F1923",OK="#22C55E",WARN="#F59E0B",DANGER="#EF4444";

const DEFAULT_D25=[{m:"Mar",mq:2,as:2,rM:12400,rA:4000,co:16400,cg:7723,op:0},{m:"Abr",mq:0,as:0,rM:0,rA:0,co:0,cg:0,op:0},{m:"May",mq:6,as:5,rM:37200,rA:10000,co:47200,cg:17460,op:3100},{m:"Jun",mq:8,as:2,rM:48800,rA:4000,co:52800,cg:23280,op:3100},{m:"Jul",mq:17,as:7,rM:105400,rA:14000,co:84200,cg:49470,op:3100},{m:"Ago",mq:14,as:8,rM:86800,rA:16000,co:92600,cg:40740,op:3100},{m:"Sep",mq:20,as:9,rM:124000,rA:18000,co:143700,cg:58200,op:7805},{m:"Oct",mq:20,as:6,rM:124000,rA:12000,co:146892,cg:58200,op:7805},{m:"Nov",mq:12,as:5,rM:74400,rA:10000,co:86000,cg:34920,op:7805},{m:"Dic",mq:25,as:9,rM:154400,rA:18000,co:148400,cg:72750,op:7805}];
const DEFAULT_D26=[{m:"Ene",mq:19,as:12,rM:117800,rA:24000,co:105024,cg:55290,op:10407},{m:"Feb",mq:11,as:5,rM:68200,rA:10000,co:65375,cg:32010,op:10407},{m:"Mar",mq:10,as:4,rM:63800,rA:8200,co:26100,cg:29100,op:10407}];



function compute(d){return d.map(x=>{const t=x.rM+x.rA,g=t-x.cg,n=g-x.op,cp=x.co-x.cg-x.op;return{...x,tr:t,gp:g,np:n,cp,ce:t>0?(x.co/t*100):0,mg:t>0?(n/t*100):0};});}
const sumAll=a=>a.reduce((s,d)=>({mq:s.mq+d.mq,as:s.as+d.as,tr:s.tr+d.tr,co:s.co+d.co,cg:s.cg+d.cg,op:s.op+d.op,gp:s.gp+d.gp,np:s.np+d.np,cp:s.cp+d.cp}),{mq:0,as:0,tr:0,co:0,cg:0,op:0,gp:0,np:0,cp:0});
const F=n=>`$${Math.round(n).toLocaleString()}`;const PC=n=>`${n.toFixed(1)}%`;
const Bar=({v,mx,co})=>(<div style={{background:"#1E293B",borderRadius:3,height:6,width:"100%",overflow:"hidden"}}><div style={{width:`${Math.min((v/(mx||1))*100,100)}%`,height:"100%",background:co,borderRadius:3}}/></div>);
const K=({l,v,s,co})=>(<div style={{background:"#1E293B",borderRadius:8,padding:"9px 11px",border:"1px solid #334155",flex:1,minWidth:105}}><div style={{fontSize:8,color:"#94A3B8",marginBottom:1}}>{l}</div><div style={{fontSize:16,fontWeight:800,color:co||"#fff"}}>{v}</div>{s&&<div style={{fontSize:8,color:"#64748B",marginTop:1}}>{s}</div>}</div>);
const th={padding:"5px 6px",textAlign:"left",fontSize:8,fontWeight:700,color:"#94A3B8"};const thr={...th,textAlign:"right"};const td={padding:"5px 6px",fontSize:10,color:"#E2E8F0"};const tdc={...td,textAlign:"center"};const tdr={...td,textAlign:"right"};
const Inf=({children,color})=>(<div style={{background:"#0F172A",borderRadius:6,padding:"10px 12px",border:`1px solid ${color||"#334155"}33`,marginTop:10}}>{children}</div>);


const INIT_C25=[
{id:1,n:"Franchesca Mena",ced:"402-2597189-0",tipo:"PF",mp:"Transferencia",fc:"2025-05-03",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:2,vta:8200,pag:8200,mon:"USD",tasa:60.60,compra:"Maq. + Asesoria",emp:""},
{id:2,n:"Madelyn Sánchez / Cesar",ced:"001-1471491-8",tipo:"PF",mp:"Transferencia",fc:"2025-05-12",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:1,g:2,vta:8200,pag:8200,mon:"USD",tasa:60.60,compra:"Maq. + Asesoria",emp:""},
{id:3,n:"Samuel Garrido",ced:"402-2706270-6",tipo:"PF",mp:"Transferencia",fc:"2025-05-23",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:2,vta:8200,pag:8200,mon:"USD",tasa:60.60,compra:"Maq. + Asesoria",emp:""},
{id:4,n:"Idalisa Ogando Ortiz",ced:"001-13122444-4",tipo:"PF",mp:"Transferencia",fc:"2025-05-23",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:2,vta:8200,pag:8200,mon:"USD",tasa:60.61,compra:"Maq. + Asesoria",emp:""},
{id:5,n:"Dalvin Jesús Toledo Acosta",ced:"402-2288961-6",tipo:"PF",mp:"Transferencia",fc:"2025-06-03",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:2,as:0,g:2,vta:11600,pag:11600,mon:"USD",tasa:60.62,compra:"Maquina",emp:""},
{id:6,n:"Ruth Yamel Mata Morales",ced:"001-1921874-1",tipo:"PF",mp:"Transferencia",fc:"2025-05-20",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:2,vta:8200,pag:8200,mon:"USD",tasa:60.63,compra:"Maq. + Asesoria",emp:""},
{id:7,n:"Vinicio Dominguez",ced:"001-1908273-3",tipo:"PF",mp:"Transferencia",fc:"2025-05-21",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:2,vta:6200,pag:6200,mon:"USD",tasa:58.00,compra:"Maquina",emp:"VADIG Tecnologia"},
{id:8,n:"René Alejandro Arbaje Díaz",ced:"001-1819569-2",tipo:"PF",mp:"Transferencia",fc:"2025-06-04",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:2,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:9,n:"Julio Manuel Arias Durán",ced:"001-1278615-7",tipo:"PF",mp:"Transferencia",fc:"2025-06-10",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:2,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:10,n:"Casandra Heredia / Alain González",ced:"402-2585861-8",tipo:"PF",mp:"Transferencia",fc:"2025-06-14",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Socio",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:11,n:"Julio Alexander Eugenia Rodríguez",ced:"402-2486001-1",tipo:"PF",mp:"Transferencia",fc:"2025-06-14",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:12,n:"Joan Fernando Castro",ced:"1-3240052-6",tipo:"PF",mp:"Transferencia",fc:"2025-06-20",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:2,as:0,g:3,vta:12400,pag:12400,mon:"USD",tasa:0,compra:"Maquina",emp:"Castro Sport"},
{id:13,n:"Daniel Guzmán / Nicely Herrera",ced:"031-0472242-0",tipo:"PF",mp:"Transferencia",fc:"2025-07-04",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:4,as:1,g:3,vta:26800,pag:26800,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:14,n:"Cristopher Moscoso Florencio",ced:"402-1427040-3",tipo:"PF",mp:"Transferencia",fc:"2025-07-16",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Socio",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:15,n:"Noella Portuondo Bretón",ced:"001-1375959-1",tipo:"PF",mp:"Transferencia",fc:"2025-07-19",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Socio",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:16,n:"Juan Miguel Sosa / Melissa Baez",ced:"402-2069141-0",tipo:"PF",mp:"Transferencia",fc:"2025-07-16",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:3,as:1,g:3,vta:20600,pag:20600,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:17,n:"Ironelly De Los Santos",ced:"002-0135487-5",tipo:"PF",mp:"Transferencia",fc:"2025-07-19",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:18,n:"Jean Carlos Martínez Roca",ced:"001-1682128-1",tipo:"PF",mp:"Transferencia",fc:"2025-07-12",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:3,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:19,n:"Chamil Marte Alcántara",ced:"228-0005593-5",tipo:"PF",mp:"Transferencia",fc:"2025-07-21",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:20,n:"Ulises",ced:"",tipo:"PF",mp:"Transferencia",fc:"2025-07-21",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:3,as:0,g:3,vta:18600,pag:18600,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:21,n:"Darwin Anderson Luis",ced:"001-1941983-6",tipo:"PF",mp:"Transferencia",fc:"2025-08-07",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:3,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:22,n:"Ellen Camyl Albuerme",ced:"402-2474633-5",tipo:"PF",mp:"Transferencia",fc:"2025-08-08",fe:"2025-10-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:0,g:3,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:23,n:"Yeymy Bueno Estrella",ced:"223-0018473-0",tipo:"PF",mp:"Transferencia",fc:"2025-07-24",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:24,n:"Elvis y Cynthia Meléndez",ced:"001-1154017-5",tipo:"PF",mp:"Transferencia",fc:"2025-08-05",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:3,as:1,g:4,vta:20600,pag:20600,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:25,n:"Ruth Yamel Mata Morales",ced:"001-1921874-1",tipo:"PF",mp:"Transferencia",fc:"2025-08-01",fe:"2025-08-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:4,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:26,n:"Gabriel Antonio Ortíz",ced:"001-1852259-8",tipo:"PF",mp:"Transferencia",fc:"2025-07-27",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:4,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:27,n:"Lia Patricia Herrera / Gabriel Diplan",ced:"002-0097448-3",tipo:"PF",mp:"Transferencia",fc:"2025-08-10",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:28,n:"Starkys Calvillo",ced:"223-0096060-0",tipo:"PF",mp:"Transferencia",fc:"2025-08-15",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:4,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:29,n:"Beatriz Abreu",ced:"",tipo:"PF",mp:"Transferencia",fc:"2025-08-17",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:30,n:"Jose Luis Abreu Abikarram",ced:"",tipo:"PF",mp:"Transferencia",fc:"2025-08-17",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:31,n:"Braulio Ismael Ynoa",ced:"402-0063036-2",tipo:"PF",mp:"Transferencia",fc:"2025-08-25",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:32,n:"Puly Alejandra García",ced:"001-1706372-7",tipo:"PF",mp:"Transferencia",fc:"2025-08-25",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:4,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:33,n:"Natanelle Caram Ibarra",ced:"001-1675395-5",tipo:"PF",mp:"Transferencia",fc:"2025-08-25",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:34,n:"Yakayra Toledo Medina",ced:"402-3470240-1",tipo:"PF",mp:"Transferencia",fc:"2025-08-25",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:35,n:"Daniel Guzmán / Nicely Herrera",ced:"031-0472242-0",tipo:"PF",mp:"Transferencia",fc:"2025-09-02",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:2,as:0,g:4,vta:12400,pag:12400,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:36,n:"Joan Genao / Michelle Salas",ced:"402-3051856-1",tipo:"PF",mp:"Transferencia",fc:"2025-09-03",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:37,n:"Sandra Alcalá / Iván",ced:"",tipo:"PF",mp:"Transferencia",fc:"2025-09-07",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:1,g:4,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:38,n:"Miguel Andujar",ced:"",tipo:"PF",mp:"Transferencia",fc:"2025-09-05",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Solo",mq:3,as:1,g:4,vta:20600,pag:20600,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:39,n:"Luis Bayonet",ced:"001-0333024-7",tipo:"PF",mp:"Transferencia",fc:"2025-09-08",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:40,n:"Carlos y Miguel",ced:"1-33-49140-2",tipo:"Empresa",mp:"Transferencia",fc:"2025-09-08",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Socio",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:"Los Mateo Matzo Inversiones"},
{id:41,n:"César David Rodríguez",ced:"402-3349209-5",tipo:"PF",mp:"Transferencia",fc:"2025-09-08",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:42,n:"Starkys Calvillo",ced:"223-0096060-0",tipo:"PF",mp:"Transferencia",fc:"2025-09-12",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Solo",mq:4,as:0,g:5,vta:24800,pag:24800,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:43,n:"Wilner Sánchez Ramírez",ced:"402-13921527",tipo:"PF",mp:"Transferencia",fc:"2025-09-17",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:44,n:"Ramón Miranda / Juan Vélez",ced:"402-3544492-0",tipo:"PF",mp:"Transferencia",fc:"2025-09-18",fe:"",closer:"Ulises",setter:"",grupo:"Socio",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:45,n:"Yoenny Santana",ced:"00500431192",tipo:"PF",mp:"Transferencia",fc:"2025-09-19",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:"Auto Repuestos Yoenny Santana SRL"},
{id:46,n:"Saúl Luciano Hidalgo",ced:"402-3456888-5",tipo:"PF",mp:"Transferencia",fc:"2025-09-20",fe:"2025-11-30",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:47,n:"Nirca De La Cruz",ced:"2300904592",tipo:"PF",mp:"Transferencia",fc:"2025-09-23",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:48,n:"Jefersson Montilla",ced:"402-2231512-5",tipo:"PF",mp:"Transferencia",fc:"2025-09-25",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:49,n:"Robert Feliz Guzmán",ced:"001-1817187-5",tipo:"PF",mp:"Transferencia",fc:"2025-10-01",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:5,vta:8200,pag:8200,mon:"USD",tasa:62.88,compra:"Maq. + Asesoria",emp:""},
{id:50,n:"Eduard Santos González",ced:"402-2218431-5",tipo:"PF",mp:"Transferencia",fc:"2025-10-01",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:2,as:0,g:5,vta:12400,pag:12400,mon:"USD",tasa:62.91,compra:"Maquina",emp:""},
{id:51,n:"Víctor Fernández Cabrera",ced:"001-0131505-9",tipo:"PF",mp:"Transferencia",fc:"2025-10-03",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:2,as:1,g:5,vta:14400,pag:14400,mon:"USD",tasa:62.98,compra:"Maq. + Asesoria",emp:""},
{id:52,n:"Ángel Andujar",ced:"130515573",tipo:"Empresa",mp:"Transferencia",fc:"2025-10-07",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:63.18,compra:"Maquina",emp:"Rep. Andujar Lozada Tecnología"},
{id:53,n:"Ellen Camyl Albuerme",ced:"402-2474633-5",tipo:"PF",mp:"Transferencia",fc:"2025-10-09",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Pareja",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:63.24,compra:"Maquina",emp:""},
{id:54,n:"Vinicio Dominguez",ced:"131-64338-8",tipo:"Empresa",mp:"Transferencia",fc:"2025-10-09",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:63.24,compra:"Maquina",emp:"VADIG Tecnologia"},
{id:55,n:"René Arbaje Díaz",ced:"001-1819569-2",tipo:"PF",mp:"Transferencia",fc:"2025-10-12",fe:"2025-11-30",closer:"",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:63.42,compra:"Maquina",emp:""},
{id:56,n:"Jose Rubio (Rubev)",ced:"40222284305",tipo:"Empresa",mp:"Transferencia",fc:"2025-10-11",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:5,vta:6200,pag:6200,mon:"USD",tasa:63.42,compra:"Maquina",emp:"Rubev Investments"},
{id:57,n:"Dubai Eirl / Alberto",ced:"131558577",tipo:"Empresa",mp:"Transferencia",fc:"2025-10-15",fe:"2026-02-14",closer:"Ulises",setter:"",grupo:"Socio",mq:2,as:1,g:6,vta:14400,pag:14400,mon:"USD",tasa:63.71,compra:"Maq. + Asesoria",emp:"Dubai Eirl"},
{id:58,n:"Héctor Hernández Taveras",ced:"402-1303197-0",tipo:"PF",mp:"Transferencia",fc:"2025-10-20",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:63.42,compra:"Maq. + Asesoria",emp:""},
{id:59,n:"Elvis y Cynthia Meléndez",ced:"001-1154017-5",tipo:"PF",mp:"Transferencia",fc:"2025-10-24",fe:"2025-11-01",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:0,g:6,vta:6200,pag:6200,mon:"USD",tasa:64.32,compra:"Maquina",emp:""},
{id:60,n:"Ely Cruz",ced:"1-31-87802-4",tipo:"PF",mp:"Transferencia",fc:"2025-10-29",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:64.25,compra:"Maq. + Asesoria",emp:""},
{id:61,n:"Alba Ironelly Núñez",ced:"22400565176",tipo:"PF",mp:"Transferencia",fc:"2025-10-30",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:64.25,compra:"Maq. + Asesoria",emp:""},
{id:62,n:"Jean Pierre Licairac",ced:"40222616456",tipo:"PF",mp:"Transferencia",fc:"2025-10-31",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:6,vta:6200,pag:6200,mon:"USD",tasa:64.40,compra:"Maquina",emp:""},
{id:63,n:"César David Rodríguez",ced:"402-3349209-5",tipo:"PF",mp:"Transferencia",fc:"2025-10-31",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:3,as:0,g:6,vta:18600,pag:18600,mon:"USD",tasa:62.00,compra:"Maquina",emp:""},
{id:64,n:"Katherine Gómez (Ruta Express)",ced:"133462915",tipo:"Empresa",mp:"Transferencia",fc:"2025-11-10",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:2,as:1,g:6,vta:14400,pag:14400,mon:"USD",tasa:64.59,compra:"Maq. + Asesoria",emp:"Ruta Express RD"},
{id:65,n:"Juan Isidro Valerio",ced:"001-1549211-8",tipo:"PF",mp:"Transferencia",fc:"2025-11-14",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:64.50,compra:"Maq. + Asesoria",emp:""},
{id:66,n:"Denisse Ortega (Bloom Beauty)",ced:"133068753",tipo:"Empresa",mp:"Transferencia",fc:"2025-11-17",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:9,vta:6200,pag:5545.22,mon:"USD",tasa:64.55,compra:"Maquina",emp:"Bloom Beauty Store BBS EIRL"},
{id:67,n:"Ricky Fortuna Pilarte",ced:"40220466748",tipo:"PF",mp:"Transferencia",fc:"2025-11-17",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:64.50,compra:"Maq. + Asesoria",emp:""},
{id:68,n:"Iván Feliz Montas",ced:"402-1217380-7",tipo:"PF",mp:"Transferencia",fc:"2025-11-19",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:64.50,compra:"Maq. + Asesoria",emp:""},
{id:69,n:"Ellen Camyl Albuerme",ced:"402-2474633-5",tipo:"PF",mp:"Transferencia",fc:"2025-11-20",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Pareja",mq:2,as:0,g:6,vta:12400,pag:12400,mon:"USD",tasa:63.83,compra:"Maquina",emp:""},
{id:70,n:"Marcelle Puello Veras",ced:"40225696216",tipo:"PF",mp:"Transferencia",fc:"2025-11-22",fe:"2026-02-14",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:6,vta:8200,pag:8200,mon:"USD",tasa:64.50,compra:"Maq. + Asesoria",emp:""},
{id:71,n:"Idalisa Ogando Ortiz",ced:"001-13122444-4",tipo:"PF",mp:"Transferencia",fc:"2025-11-27",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:4316.55,mon:"USD",tasa:63.84,compra:"Maquina",emp:""},
{id:72,n:"Ruth Yamel Mata Morales",ced:"001-1921874-1",tipo:"PF",mp:"Transferencia",fc:"2025-11-28",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:4340,mon:"USD",tasa:63.97,compra:"Maquina",emp:""},
{id:73,n:"Marcos Pérez Gómez",ced:"001-1947745-3",tipo:"PF",mp:"Transferencia",fc:"2025-11-29",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:74,n:"Larimar Meléndez",ced:"114116288",tipo:"PF",mp:"Transferencia",fc:"2025-12-04",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:3100,mon:"USD",tasa:64.31,compra:"Maquina",emp:""},
{id:75,n:"Víctor Fernández Cabrera",ced:"001-0131505-9",tipo:"PF",mp:"Transferencia",fc:"2025-12-05",fe:"2025-11-30",closer:"Brianny",setter:"",grupo:"Solo",mq:3,as:0,g:6,vta:18600,pag:18600,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:76,n:"Augusto García Ballista",ced:"200080364",tipo:"PF",mp:"Transferencia",fc:"2025-12-05",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:2,as:1,g:7,vta:14400,pag:10080,mon:"USD",tasa:32.36,compra:"Maq. + Asesoria",emp:""},
{id:77,n:"Miguel de la Cruz Ogando",ced:"402-3076828-1",tipo:"PF",mp:"Transferencia",fc:"2025-12-10",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:7,vta:8200,pag:8200,mon:"USD",tasa:64.71,compra:"Maq. + Asesoria",emp:""},
{id:78,n:"Puly Alejandra García",ced:"001-1706372-7",tipo:"PF",mp:"Transferencia",fc:"2025-12-11",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:3000,mon:"USD",tasa:64.72,compra:"Maquina",emp:""},
{id:79,n:"Marcial Lora González",ced:"026-0136999-0",tipo:"PF",mp:"Transferencia",fc:"2025-12-13",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6000,pag:3000,mon:"USD",tasa:64.71,compra:"Maquina",emp:""},
{id:80,n:"Enmanuel Fernández Ubiera",ced:"402-1089104-6",tipo:"PF",mp:"Transferencia",fc:"2025-12-15",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:6200,mon:"USD",tasa:64.08,compra:"Maquina",emp:""},
{id:81,n:"Natanelle Caram Ibarra",ced:"001-1675395-5",tipo:"PF",mp:"Transferencia",fc:"2025-12-15",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:6200,mon:"USD",tasa:64.09,compra:"Maquina",emp:""},
{id:82,n:"Carlos y Miguel",ced:"1-33-49140-2",tipo:"Empresa",mp:"Transferencia",fc:"2025-12-15",fe:"",closer:"Brianny",setter:"",grupo:"Socio",mq:2,as:0,g:7,vta:12400,pag:12400,mon:"USD",tasa:64.06,compra:"Maquina",emp:"Los Mateo Matzo Inversiones"},
{id:83,n:"Karla Ballis Salvucci",ced:"402-0954976-1",tipo:"PF",mp:"Transferencia",fc:"2025-12-16",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:7,vta:8000,pag:8000,mon:"USD",tasa:63.81,compra:"Maq. + Asesoria",emp:""},
{id:84,n:"Luz María Feliz Sánchez",ced:"402-3042544-5",tipo:"PF",mp:"Transferencia",fc:"2025-12-17",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:2,as:1,g:7,vta:14400,pag:14400,mon:"USD",tasa:63.69,compra:"Maq. + Asesoria",emp:""},
{id:85,n:"Lia Patricia Herrera",ced:"200974483",tipo:"PF",mp:"Transferencia",fc:"2025-12-22",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:3144.65,mon:"USD",tasa:63.60,compra:"Maquina",emp:""},
{id:86,n:"Glenny Gómez",ced:"037-0013830-2",tipo:"PF",mp:"Transferencia",fc:"2025-12-23",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:7,vta:8200,pag:8200,mon:"USD",tasa:63.69,compra:"Maq. + Asesoria",emp:""},
{id:87,n:"Fernando Sosa",ced:"402-0036640-5",tipo:"PF",mp:"Transferencia",fc:"2025-12-23",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:7,vta:6200,pag:6200,mon:"USD",tasa:63.72,compra:"Maquina",emp:""},
{id:88,n:"Dionys Rodríguez Pérez",ced:"402-1277284-8",tipo:"PF",mp:"Transferencia",fc:"2025-12-24",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:7,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:89,n:"Jose Aníbal Peralta",ced:"001-0915710-7",tipo:"PF",mp:"Link Azul",fc:"2025-12-25",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:7,vta:8200,pag:6200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:90,n:"Marcial Lora González",ced:"026-0136999-0",tipo:"PF",mp:"Transferencia",fc:"2025-12-26",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:8,vta:6000,pag:2954.79,mon:"USD",tasa:64.71,compra:"Maquina",emp:""},
{id:91,n:"Albethy Colón Bello",ced:"402-237-00002",tipo:"PF",mp:"Transferencia",fc:"2025-12-30",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:8,vta:6200,pag:4000,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:92,n:"Andrés de la Rosa",ced:"223-0102068-5",tipo:"PF",mp:"Transferencia",fc:"2025-12-30",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:93,n:"Mickel Sinisterra",ced:"40220199711",tipo:"PF",mp:"Transferencia",fc:"2025-12-30",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
          ];

const INIT_C26=[
{id:101,n:"Marcela Bermúdez",ced:"40218883680",tipo:"PF",mp:"Transferencia",fc:"2026-01-06",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:102,n:"Salomón Contreras",ced:"131822185",tipo:"Empresa",mp:"Transferencia",fc:"2026-01-09",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:"Trion Consulting SRL"},
{id:103,n:"Juan Miguel Sosa / Melissa Baez",ced:"",tipo:"PF",mp:"Link Azul",fc:"2026-01-09",fe:"",closer:"Ulises",setter:"",grupo:"Pareja",mq:2,as:0,g:8,vta:12400,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:104,n:"Cheylin Morillo Luciano",ced:"1700236084",tipo:"PF",mp:"Transferencia",fc:"2026-01-10",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:6700,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:105,n:"Natanelle Caram Ibarra",ced:"116753955",tipo:"PF",mp:"Transferencia",fc:"2026-01-10",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:8,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:106,n:"Puly Alejandra García",ced:"117063727",tipo:"PF",mp:"Transferencia",fc:"2026-01-12",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:2,as:0,g:8,vta:12400,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:107,n:"Jabnia Pérez Paniagua",ced:"22301068817",tipo:"PF",mp:"Transferencia",fc:"2026-01-13",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:108,n:"Saulina Sánchez Gómez",ced:"40224149407",tipo:"PF",mp:"Link Azul",fc:"2026-01-14",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:64.13,compra:"Maq. + Asesoria",emp:""},
{id:109,n:"Indhira Reyes Reynoso",ced:"110911112",tipo:"PF",mp:"Link Azul",fc:"2026-01-14",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:64.13,compra:"Maq. + Asesoria",emp:""},
{id:110,n:"María Cecilia Pérez",ced:"108253147",tipo:"PF",mp:"Transferencia",fc:"2026-01-20",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:63.84,compra:"Maq. + Asesoria",emp:""},
{id:111,n:"Vinicio Dominguez",ced:"131643388",tipo:"Empresa",mp:"Transferencia",fc:"2026-01-22",fe:"",closer:"Ulises",setter:"",grupo:"Solo",mq:1,as:0,g:8,vta:6200,pag:5121.20,mon:"USD",tasa:0,compra:"Maquina",emp:"VADIG Tecnologia"},
{id:112,n:"Jean Luis Raposo Rosa",ced:"40223388295",tipo:"PF",mp:"Transferencia",fc:"2026-01-23",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:113,n:"Carolina Mejía Pimentel",ced:"40209686936",tipo:"PF",mp:"Transferencia",fc:"2026-01-23",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:8,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:114,n:"Elvis y Cynthia Meléndez",ced:"001-1154017-5",tipo:"PF",mp:"Link Azul",fc:"2026-01-23",fe:"",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:0,g:8,vta:6200,pag:4249.63,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:115,n:"Jhomelger García Gámez",ced:"40253722248",tipo:"PF",mp:"Transferencia",fc:"2026-01-29",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:116,n:"María de los Ángeles Almonte",ced:"40222378123",tipo:"PF",mp:"Transferencia",fc:"2026-01-30",fe:"",closer:"Brianny",setter:"Diana",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:4703.69,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:117,n:"Perla Pichardo",ced:"40200434229",tipo:"PF",mp:"Transferencia",fc:"2026-01-31",fe:"",closer:"Ulises",setter:"Diana",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:118,n:"Madelin Santana",ced:"40224883062",tipo:"PF",mp:"Transferencia",fc:"2026-02-02",fe:"",closer:"Ulises",setter:"Diana",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:119,n:"Eric Guzmán Pérez",ced:"117662866",tipo:"PF",mp:"Link Azul",fc:"2026-02-02",fe:"",closer:"Brianny",setter:"Diana",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:120,n:"Carol Hernández Severino",ced:"40215685500",tipo:"PF",mp:"Transferencia",fc:"2026-02-03",fe:"",closer:"Ulises",setter:"Diana",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:6134,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:121,n:"Elvin Ramírez Martínez",ced:"132877357",tipo:"Empresa",mp:"Transferencia",fc:"2026-02-04",fe:"",closer:"Brianny",setter:"Diana",grupo:"Solo",mq:3,as:1,g:9,vta:20600,pag:12000,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:"Design Group Studio SRL"},
{id:122,n:"Rocío",ced:"",tipo:"PF",mp:"Transferencia",fc:"2026-02-05",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:2,as:1,g:9,vta:14400,pag:13441.33,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:123,n:"Vinicio Dominguez",ced:"131643388",tipo:"Empresa",mp:"Transferencia",fc:"2026-02-18",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:1,as:0,g:9,vta:6200,pag:1000,mon:"USD",tasa:0,compra:"Maquina",emp:"VADIG Tecnologia"},
{id:124,n:"Emil Henríquez Luna",ced:"001-1892065-1",tipo:"PF",mp:"Transferencia",fc:"2026-02-24",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:1,as:0,g:9,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:125,n:"Raquel Gómez De Capellán",ced:"047-0142553-2",tipo:"PF",mp:"Transferencia",fc:"2026-02-27",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:1,as:0,g:9,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:126,n:"Elvis Meléndez",ced:"001-1154017-5",tipo:"PF",mp:"Link Azul",fc:"2026-02-21",fe:"",closer:"Ulises",setter:"",grupo:"Pareja",mq:1,as:0,g:9,vta:6200,pag:3999.63,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:127,n:"Ashley Quezada",ced:"402-3309460-2",tipo:"PF",mp:"Transferencia",fc:"2026-03-08",fe:"",closer:"Ulises",setter:"Diana",grupo:"Solo",mq:2,as:1,g:9,vta:14400,pag:14400,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:128,n:"Rocío",ced:"",tipo:"PF",mp:"Transferencia",fc:"2026-03-12",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:1,as:0,g:9,vta:6200,pag:2500,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:129,n:"Rodrigo",ced:"",tipo:"PF",mp:"Link Azul",fc:"2026-03-12",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:2,as:0,g:9,vta:12400,pag:4100,mon:"USD",tasa:0,compra:"Maquina",emp:""},
{id:130,n:"Beatriz Abreu",ced:"133-546981",tipo:"Empresa",mp:"Transferencia",fc:"2026-03-13",fe:"",closer:"Ulises",setter:"Brianny",grupo:"Solo",mq:1,as:0,g:9,vta:6200,pag:6200,mon:"USD",tasa:0,compra:"Maquina",emp:"Bite Box DARB Group SRL"},
{id:131,n:"Guillermo Mañon",ced:"008-0035006-8",tipo:"PF",mp:"Transferencia",fc:"2026-03-13",fe:"",closer:"Brianny",setter:"Brianny",grupo:"Solo",mq:1,as:1,g:9,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:132,n:"Luis Carlos Fermín",ced:"402-2252809-9",tipo:"PF",mp:"Transferencia",fc:"2026-03-13",fe:"",closer:"Ulises",setter:"Diana",grupo:"Solo",mq:1,as:1,g:10,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:133,n:"Lourdes Carmona",ced:"133-249965",tipo:"PF",mp:"Transferencia",fc:"2026-03-16",fe:"",closer:"Brianny",setter:"Diana",grupo:"Solo",mq:1,as:1,g:10,vta:8200,pag:4000,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
{id:135,n:"Andrés Elías Reyes García",ced:"402-0059058-2",tipo:"PF",mp:"Transferencia",fc:"2026-03-17",fe:"",closer:"Ulises",setter:"Diana",grupo:"Solo",mq:1,as:1,g:10,vta:8200,pag:8200,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:"",ref:"",cuenta:"",itbis:0,comAzul:0,factura:"",abonos:[]},
{id:134,n:"Jael Melina Valdez",ced:"001-1869243-3",tipo:"PF",mp:"Transferencia",fc:"2026-03-16",fe:"",closer:"Brianny",setter:"Diana",grupo:"Solo",mq:1,as:1,g:10,vta:8200,pag:3468.93,mon:"USD",tasa:0,compra:"Maq. + Asesoria",emp:""},
          ];

function QuarterlyView({data,vw}){
const qMap={"Ene":1,"Feb":1,"Mar":1,"Abr":2,"May":2,"Jun":2,"Jul":3,"Ago":3,"Sep":3,"Oct":4,"Nov":4,"Dic":4};
const qs={};
data.forEach(d=>{const q="Q"+(qMap[d.m]||1);if(!qs[q])qs[q]={rev:0,co:0,np:0,cp:0,mq:0,as:0,months:0};qs[q].rev+=d.tr;qs[q].co+=d.co;qs[q].np+=d.np;qs[q].cp+=d.cp;qs[q].mq+=d.mq;qs[q].as+=d.as;qs[q].months++;});
const qArr=Object.entries(qs).sort((a,b)=>a[0].localeCompare(b[0]));
const maxRev=Math.max(...qArr.map(([,q])=>q.rev),1);
const delta=(a,b)=>(!b||b===0)?null:((a-b)/b*100);
const DB=({val})=>{if(val===null||val===undefined)return <span style={{fontSize:8,color:"#475569"}}>—</span>;const up=val>=0;return <span style={{fontSize:8,fontWeight:700,color:up?OK:DANGER}}>{up?"▲":"▼"} {Math.abs(val).toFixed(0)}%</span>;};
return(
<div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",padding:12,marginTop:8}}>
<div style={{fontSize:10,fontWeight:700,color:GOLD,marginBottom:8}}>Vista trimestral</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{qArr.map(([qName,q],idx)=>{
const prev=idx>0?qArr[idx-1][1]:null;
const profit=vw==="cash"?q.cp:q.np;
const prevProfit=prev?(vw==="cash"?prev.cp:prev.np):null;
const effQ=q.rev>0?(q.co/q.rev*100):0;
return(
<div key={qName} style={{flex:1,minWidth:110,background:"#0F172A",borderRadius:6,padding:10,border:"1px solid #334155"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<span style={{fontSize:13,fontWeight:800,color:"#fff"}}>{qName}</span>
<span style={{fontSize:8,color:"#64748B"}}>{q.months}m</span>
</div>
<div style={{marginBottom:4}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
<span style={{fontSize:8,color:"#94A3B8"}}>Facturado</span>
<div style={{display:"flex",alignItems:"center",gap:4}}><DB val={delta(q.rev,prev?.rev)}/><span style={{fontSize:10,fontWeight:700,color:"#fff"}}>{F(q.rev)}</span></div>
</div>
<Bar v={q.rev} mx={maxRev} co={BLUE}/>
</div>
<div style={{marginBottom:4}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
<span style={{fontSize:8,color:"#94A3B8"}}>Cobrado</span>
<div style={{display:"flex",alignItems:"center",gap:4}}><DB val={delta(q.co,prev?.co)}/><span style={{fontSize:10,fontWeight:700,color:GOLD}}>{F(q.co)}</span></div>
</div>
<Bar v={q.co} mx={maxRev} co={GOLD}/>
</div>
<div style={{borderTop:"1px solid #334155",paddingTop:4,marginTop:3}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:8,color:"#94A3B8"}}>{vw==="cash"?"Caja":"Neta"}</span>
<div style={{display:"flex",alignItems:"center",gap:4}}><DB val={delta(profit,prevProfit)}/><span style={{fontSize:10,fontWeight:700,color:profit>0?OK:DANGER}}>{F(profit)}</span></div>
</div>
<div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
<span style={{fontSize:8,color:"#64748B"}}>Eficiencia</span>
<span style={{fontSize:9,fontWeight:700,color:effQ>=90?OK:effQ>=70?WARN:DANGER}}>{PC(effQ)}</span>
</div>
<div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
<span style={{fontSize:8,color:"#64748B"}}>Máquinas</span>
<div style={{display:"flex",alignItems:"center",gap:4}}><DB val={delta(q.mq,prev?.mq)}/><span style={{fontSize:9,color:"#fff"}}>{q.mq}</span></div>
</div>
</div>
</div>
);
})}
</div>
</div>
);
}
function UmbralPanel({dynAd,umbral,overrides,setOverrides,editId,setEditId}){
  const co=umbral==="vence"?DANGER:umbral==="30"?WARN:umbral==="60"?"#F97316":umbral==="90"?STEEL:OK;
  const filtered=dynAd.filter(a=>{
    if(umbral==="vence")return a.dl>=0&&a.dl<=1;
    if(umbral==="30")return a.dl>1&&a.dl<=30;
    if(umbral==="60")return a.dl>30&&a.dl<=60;
    if(umbral==="90")return a.dl>60&&a.dl<=90;
    if(umbral==="90+")return a.dl>90;
    return false;
  }).sort((a,b)=>a.dl-b.dl);
  return(
    <div style={{background:"#0F172A",borderRadius:6,padding:10,marginBottom:8,border:`1px solid ${co}44`}}>
      <div style={{fontSize:9,fontWeight:700,color:co,marginBottom:6}}>{filtered.length} clientes en este umbral</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
        <thead><tr style={{background:"#1E293B"}}>
          <th style={th}>Cliente</th><th style={th}>F. inicio</th>
          <th style={{...th,textAlign:"right"}}>Vence</th><th style={{...th,textAlign:"right"}}>Días</th><th style={{...th,textAlign:"right"}}>Estado</th>
        </tr></thead>
        <tbody>{filtered.map((a,i)=>{
          const exp=new Date(a.fechaInicio);exp.setMonth(exp.getMonth()+4);
          const expStr=exp.toISOString().split("T")[0];
          const isEditing=editId==="ases_"+a.k;
          return(<tr key={i} style={{borderBottom:"1px solid #334155"}}>
            <td style={{...td,fontWeight:600}}>{a.n}</td>
            <td style={td}>{isEditing?(
              <div style={{display:"flex",gap:3,alignItems:"center"}}>
                <input type="date" defaultValue={a.fechaInicio} onBlur={async e=>{
                  if(e.target.value){const upd={...overrides,[a.k]:e.target.value};setOverrides(upd);try{await saveData("asesoria-overrides",upd);}catch(err){}}
                  setEditId(null);
                }} style={{background:"#1E293B",border:`1px solid ${co}`,borderRadius:3,color:"#E2E8F0",fontSize:8,padding:"2px 4px"}}/>
                <span style={{fontSize:7,color:"#64748B"}}>orig: {a.fc}</span>
              </div>
            ):(
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:overrides[a.k]?co:"#94A3B8"}}>{a.fechaInicio}{overrides[a.k]&&" ✎"}</span>
                <button onClick={()=>setEditId("ases_"+a.k)} style={{background:"transparent",color:"#64748B",border:"1px solid #334155",borderRadius:2,fontSize:6,padding:"1px 4px",cursor:"pointer"}}>Editar</button>
              </div>
            )}</td>
            <td style={{...tdr,fontSize:8,color:"#94A3B8"}}>{expStr}</td>
            <td style={{...tdr,fontWeight:700,color:co}}>{a.dl===0?"Hoy":a.dl===1?"Mañana":`${a.dl}d`}</td>
            <td style={tdr}><span style={{fontSize:8,padding:"2px 5px",borderRadius:3,background:`${co}22`,color:co,fontWeight:700}}>{a.dl<=1?"Vence hoy":a.dl<=30?"Urgente":a.dl<=60?"Próxima":a.dl<=90?"En curso":"Holgada"}</span></td>
          </tr>);
        })}</tbody>
      </table>
    </div>
  );
}


export default function Dashboard(){
  const[role,setRole]=useState(null);const[loginPass,setLoginPass]=useState("");
  const[tab,setTab]=useState("Registro de Ventas");const[vw,setVw]=useState("accrual");
  const[fGrupo,setFGrupo]=useState("all");const[fTipo,setFTipo]=useState("all");const[fEmp,setFEmp]=useState("all");const[fDesde,setFDesde]=useState("");const[fHasta,setFHasta]=useState("");
  const[showForm,setShowForm]=useState(false);
  const[loading,setLoading]=useState(true);
  const[tasa,setTasa]=useState(61.5);const[tasaAuto,setTasaAuto]=useState(null);const[tasaDate,setTasaDate]=useState("");

  // === DEFAULT DATA (used when storage is empty) ===
  const defaultClients=[...INIT_C25,...INIT_C26];
  const defaultGastos=[
    {id:1,cat:"Nómina",concepto:"Salarios",monto:391488,mes:"2026-01",rec:true},
    {id:2,cat:"Nómina",concepto:"Salarios",monto:391488,mes:"2026-02",rec:true},
    {id:3,cat:"Nómina",concepto:"Salarios",monto:391488,mes:"2026-03",rec:true},
    {id:4,cat:"Logística",concepto:"Leasing vehículo",monto:43916,mes:"2026-01",rec:true},
    {id:5,cat:"Logística",concepto:"Leasing vehículo",monto:43916,mes:"2026-02",rec:true},
    {id:6,cat:"Logística",concepto:"Leasing vehículo",monto:43916,mes:"2026-03",rec:true},
    {id:7,cat:"Logística",concepto:"Seguro leasing",monto:14352,mes:"2026-01",rec:true},
    {id:8,cat:"Logística",concepto:"Seguro leasing",monto:14352,mes:"2026-02",rec:true},
    {id:9,cat:"Logística",concepto:"Seguro leasing",monto:14352,mes:"2026-03",rec:true},
    {id:10,cat:"Logística",concepto:"Combustible",monto:20000,mes:"2026-01",rec:true},
    {id:11,cat:"Logística",concepto:"Combustible",monto:20000,mes:"2026-02",rec:true},
    {id:12,cat:"Logística",concepto:"Combustible",monto:20000,mes:"2026-03",rec:true},
    {id:13,cat:"Tecnología",concepto:"Nayax",monto:10738,mes:"2026-01",rec:true},
    {id:14,cat:"Tecnología",concepto:"Nayax",monto:10738,mes:"2026-02",rec:true},
    {id:15,cat:"Tecnología",concepto:"Nayax",monto:10738,mes:"2026-03",rec:true},
    {id:16,cat:"Tecnología",concepto:"SAAS / herramientas",monto:41600,mes:"2026-01",rec:true},
    {id:17,cat:"Tecnología",concepto:"SAAS / herramientas",monto:41600,mes:"2026-02",rec:true},
    {id:18,cat:"Tecnología",concepto:"SAAS / herramientas",monto:41600,mes:"2026-03",rec:true},
    {id:19,cat:"Tecnología",concepto:"Starlink",monto:3800,mes:"2026-01",rec:true},
    {id:20,cat:"Tecnología",concepto:"Starlink",monto:3800,mes:"2026-02",rec:true},
    {id:21,cat:"Tecnología",concepto:"Starlink",monto:3800,mes:"2026-03",rec:true},
    {id:22,cat:"Servicios",concepto:"Contabilidad + RRSS",monto:64600,mes:"2026-01",rec:true},
    {id:23,cat:"Servicios",concepto:"Contabilidad + RRSS",monto:64600,mes:"2026-02",rec:true},
    {id:24,cat:"Servicios",concepto:"Contabilidad + RRSS",monto:64600,mes:"2026-03",rec:true},
    {id:25,cat:"Seguros",concepto:"Seguro salud",monto:8554,mes:"2026-01",rec:true},
    {id:26,cat:"Seguros",concepto:"Seguro salud",monto:8554,mes:"2026-02",rec:true},
    {id:27,cat:"Seguros",concepto:"Seguro salud",monto:8554,mes:"2026-03",rec:true},
    {id:28,cat:"Operativo",concepto:"Viáticos + dietas",monto:15000,mes:"2026-01",rec:true},
    {id:29,cat:"Operativo",concepto:"Viáticos + dietas",monto:15000,mes:"2026-02",rec:true},
    {id:30,cat:"Operativo",concepto:"Viáticos + dietas",monto:15000,mes:"2026-03",rec:true},
    {id:31,cat:"Operativo",concepto:"Rellenadores",monto:30000,mes:"2026-01",rec:true},
    {id:32,cat:"Operativo",concepto:"Rellenadores",monto:30000,mes:"2026-02",rec:true},
    {id:33,cat:"Operativo",concepto:"Rellenadores",monto:30000,mes:"2026-03",rec:true},
    {id:34,cat:"Operativo",concepto:"Misceláneos + financieros",monto:17440,mes:"2026-01",rec:true},
    {id:35,cat:"Operativo",concepto:"Misceláneos + financieros",monto:17440,mes:"2026-02",rec:true},
    {id:36,cat:"Operativo",concepto:"Misceláneos + financieros",monto:17440,mes:"2026-03",rec:true},
  ];
  const defaultCuentas=[
    {id:0,cat:"Empresarial",n:"Popular BIZ (DOP)",v:10144750.98,mon:"DOP"},
    {id:1,cat:"Empresarial",n:"Popular BIZ (US$)",v:5549714.34,mon:"USD",usdReal:90180},
    {id:2,cat:"Empresarial",n:"Snacks OPS",v:210021,mon:"DOP"},
    {id:3,cat:"Empresarial",n:"Santa Cruz BIZ (DOP)",v:985149.90,mon:"DOP"},
    {id:4,cat:"Empresarial",n:"Santa Cruz BIZ (US$)",v:1606737.44,mon:"USD",usdReal:36420},
    {id:5,cat:"Inversión",n:"Fondos BHD — personal",v:5797936.68,mon:"DOP"},
    {id:6,cat:"Inversión",n:"Fondos BHD — familiar",v:486097.02,mon:"DOP"},
    {id:7,cat:"Inversión",n:"Binance",v:138125.82,mon:"DOP"},
    {id:8,cat:"Personal",n:"Banreservas personal",v:7102.09,mon:"DOP"},
    {id:9,cat:"Personal",n:"Popular personal",v:48988,mon:"DOP"},
    {id:10,cat:"Otros",n:"CxC clientes",v:0,mon:"DOP",dynamic:true},
    {id:11,cat:"Otros",n:"Cash físico",v:50000,mon:"DOP"},
    {id:12,cat:"Otros",n:"Otros activos",v:339780,mon:"DOP"},
    {id:13,cat:"Otros",n:"Refund pendiente",v:100000,mon:"DOP"},
  ];

  // === PERSISTENT STATE ===
  const[clients,setClients]=useState(defaultClients);
  const[gastos,setGastos]=useState(defaultGastos);
  const[cuentasState,setCuentasState]=useState(defaultCuentas);
  const[d25State,setD25State]=useState(DEFAULT_D25);
  const[d26State,setD26State]=useState(DEFAULT_D26);
  const[refsState,setRefsState]=useState(DEFAULT_REFS);

  // Load from storage on mount
  useEffect(()=>{
    const load=async()=>{
      try{
        const[cRes,gRes,qRes,d25Res,d26Res,refRes,tasaRes]=await Promise.all([
          loadData("clients"),loadData("gastos"),loadData("cuentas"),
          loadData("d25"),loadData("d26"),loadData("refs"),loadData("tasa"),
        ]);
        if(cRes&&cRes.length>0)setClients(cRes);
        if(gRes&&gRes.length>0)setGastos(gRes);
        if(qRes&&qRes.length>0)setCuentasState(qRes);
        if(d25Res&&d25Res.length>0)setD25State(d25Res);
        if(d26Res&&d26Res.length>0)setD26State(d26Res);
        if(refRes&&refRes.length>0)setRefsState(refRes);
        if(tasaRes&&typeof tasaRes==="number")setTasa(tasaRes);
        if(aOvRes)setAsesoriaOverrides(aOvRes);;
      }catch(e){console.log("Supabase load:",e);}
      setLoading(false);
    };
    load();
  },[]);

  // Auto-save on changes (debounced)
  const saveRef=useRef(null);
  useEffect(()=>{
    if(loading)return;
    if(saveRef.current)clearTimeout(saveRef.current);
    saveRef.current=setTimeout(async()=>{
      try{
        await Promise.all([
          saveData("clients",clients),saveData("gastos",gastos),
          saveData("cuentas",cuentasState),saveData("d25",d25State),
          saveData("d26",d26State),saveData("refs",refsState),
          saveData("asesoria-overrides",asesoriaOverrides),
        ]);
      }catch(e){console.log("Supabase save:",e);}
    },1000);
  },[clients,gastos,cuentasState,d25State,d26State,refsState,tasa,loading]);

  const emptyC={n:"",ced:"",tipo:"PF",mp:"Transferencia",fc:"",fe:"",closer:"Brianny",setter:"",grupo:"Solo",mq:1,as:0,g:10,vta:6200,pag:0,mon:"USD",tasa:0,compra:"Maquina",emp:"",ref:"",cuenta:"",itbis:0,comAzul:0,factura:""};
  const[nc,setNc]=useState(emptyC);const[formErr,setFormErr]=useState("");const[editId,setEditId]=useState(null);
  const[asesoriaOverrides,setAsesoriaOverrides]=useState({});
  const[garantiaUmbral,setGarantiaUmbral]=useState(null);
  const[comPagadas,setComPagadas]=useState({});
  const[abonoMp,setAbonoMp]=useState("Transferencia");
  const[abonoCuenta,setAbonoCuenta]=useState("Popular BIZ DOP");
  const[showGastoForm,setShowGastoForm]=useState(false);
  const[newGasto,setNewGasto]=useState({cat:"Operativo",concepto:"",monto:0,mes:"2026-03",rec:false});
  const[editGastoId,setEditGastoId]=useState(null);const[editCuentaId,setEditCuentaId]=useState(null);

  // Reset to defaults (clears storage)
  const resetAll=async()=>{if(!confirm("¿Restaurar todos los datos a los valores originales? Se perderán todas las ediciones guardadas."))return;setClients(defaultClients);setGastos(defaultGastos);setCuentasState(defaultCuentas);setD25State(DEFAULT_D25);setD26State(DEFAULT_D26);setRefsState(DEFAULT_REFS);setTasa(61.5);try{await resetAllData({clients:defaultClients,gastos:defaultGastos,cuentas:defaultCuentas,d25:DEFAULT_D25,d26:DEFAULT_D26,refs:DEFAULT_REFS,tasa:61.5});alert("Datos restaurados correctamente.");}catch(e){console.log(e);}};

  // Role-based tab access
  const adminTabs=["E.R. 2025","E.R. 2026","Registro de Ventas","Gastos","Cobranza","LTV","Referidos","Garantías","Money Tracker","Guía"];
  const assistTabs=["Registro de Ventas","Cobranza","Referidos","Garantías","Guía"];
  const visibleTabs=role==="admin"?adminTabs:assistTabs;

  // Login screen
  if(!role)return(
    <div style={{background:DARK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#1E293B",borderRadius:12,padding:32,border:`1px solid ${GOLD}44`,minWidth:300,textAlign:"center"}}>
        <div style={{fontSize:8,letterSpacing:3,color:BLUE,fontWeight:700,marginBottom:4}}>SNACKS DEPOT®</div>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>Dashboard</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>setRole("admin")} style={{background:BLUE,color:"#fff",border:"none",borderRadius:6,padding:"10px 20px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Entrar como Admin</button>
          <button onClick={()=>{setRole("asistente");setTab("Registro de Ventas");}} style={{background:STEEL,color:"#fff",border:"none",borderRadius:6,padding:"10px 20px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Entrar como Asistente</button>
        </div>
        <div style={{fontSize:8,color:"#475569",marginTop:12}}>Admin: acceso completo · Asistente: registro, cobros, referidos, garantías</div>
      </div>
    </div>
  );

  // Auto-fetch USD/DOP rate
  useEffect(()=>{
    const fetchTasa=async()=>{
      try{
        const r=await fetch("https://open.er-api.com/v6/latest/USD");
        const d=await r.json();
        if(d&&d.rates&&d.rates.DOP){setTasaAuto(d.rates.DOP);setTasaDate(new Date().toLocaleDateString("es-DO"));}
      }catch(e){console.log("Tasa fetch error:",e);}
    };
    if(!loading)fetchTasa();
  },[loading]);

  if(loading)return(<div style={{background:DARK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:GOLD,fontSize:14,fontWeight:700}}>Cargando datos guardados...</div></div>);

  // Retroactive: compute itbis/comAzul for existing records missing them
  const clientsRetro=clients.map(c=>{
    const itbis=c.itbis||((c.tipo==="Empresa"||c.mp==="Link Azul")?Math.round(c.vta*0.18*100)/100:0);
    const comAzul=c.comAzul||(c.mp==="Link Azul"?Math.round(c.pag*0.0395*100)/100:0);
    const factura=c.factura||(c.tipo==="Empresa"?"B01":(c.mp==="Link Azul"?"B02":""));
    return {...c,itbis,comAzul,factura,cuenta:c.cuenta||""};
  });

  // Widgets: total ITBIS and total comisión Azul
  const totalITBIS=clientsRetro.reduce((a,c)=>a+c.itbis,0);
  const totalComAzul=clientsRetro.reduce((a,c)=>a+c.comAzul,0);

  const totalRefs=refsState.reduce((a,r)=>a+r.t,0);const refsCerrados=refsState.reduce((a,r)=>a+r.c,0);const refsSeguimiento=refsState.reduce((a,r)=>a+r.s,0);const refsPerdidos=refsState.reduce((a,r)=>a+r.p,0);
  // Dynamic referidos from clients with ref field
  const dynRefMap={};clientsRetro.filter(c=>c.ref&&c.ref.trim()).forEach(c=>{const r=c.ref.trim();if(!dynRefMap[r])dynRefMap[r]={n:r,t:0,c:1,s:0,p:0,rev:0,mq:0};else{dynRefMap[r].c++;} dynRefMap[r].t++;dynRefMap[r].rev+=c.vta;dynRefMap[r].mq+=c.mq;});
  const dynRefList=Object.values(dynRefMap).sort((a,b)=>b.t-a.t);
  const dynRefTotal=dynRefList.reduce((a,r)=>a+r.t,0);const dynRefCerrados=dynRefList.reduce((a,r)=>a+r.c,0);
  // Dynamic OPEX from gastos for 2026
  const opexByMonth26={"Ene":0,"Feb":0,"Mar":0,"Abr":0,"May":0,"Jun":0,"Jul":0,"Ago":0,"Sep":0,"Oct":0,"Nov":0,"Dic":0};
  const mesMap26={"2026-01":"Ene","2026-02":"Feb","2026-03":"Mar","2026-04":"Abr","2026-05":"May","2026-06":"Jun","2026-07":"Jul","2026-08":"Ago","2026-09":"Sep","2026-10":"Oct","2026-11":"Nov","2026-12":"Dic"};
  const mesMapRev={"01":"Ene","02":"Feb","03":"Mar","04":"Abr","05":"May","06":"Jun","07":"Jul","08":"Ago","09":"Sep","10":"Oct","11":"Nov","12":"Dic"};
  gastos.forEach(g=>{const m=mesMap26[g.mes];if(m)opexByMonth26[m]+=g.monto;});
  const tc26g=tasa;
  // Delta from NEW clients only (id>134 = added via form)
  const newSales26={"Ene":{mq:0,as:0,rM:0,rA:0,co:0},"Feb":{mq:0,as:0,rM:0,rA:0,co:0},"Mar":{mq:0,as:0,rM:0,rA:0,co:0},"Abr":{mq:0,as:0,rM:0,rA:0,co:0},"May":{mq:0,as:0,rM:0,rA:0,co:0},"Jun":{mq:0,as:0,rM:0,rA:0,co:0},"Jul":{mq:0,as:0,rM:0,rA:0,co:0},"Ago":{mq:0,as:0,rM:0,rA:0,co:0},"Sep":{mq:0,as:0,rM:0,rA:0,co:0},"Oct":{mq:0,as:0,rM:0,rA:0,co:0},"Nov":{mq:0,as:0,rM:0,rA:0,co:0},"Dic":{mq:0,as:0,rM:0,rA:0,co:0}};
  clientsRetro.filter(c=>c.id>134&&c.fc>="2026").forEach(c=>{const mm=c.fc.slice(5,7);const mes=mesMapRev[mm];if(mes&&newSales26[mes]){newSales26[mes].mq+=c.mq;newSales26[mes].as+=c.as;newSales26[mes].rM+=c.mq*6200;newSales26[mes].rA+=c.as*2000;newSales26[mes].co+=c.pag;}});
  // Build d26dyn: base d26State + delta from new registrations + new months
  const d26months=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const d26dyn=d26months.filter(m=>{const base=d26State.find(r=>r.m===m);const ns=newSales26[m];return base||ns.mq>0;}).map(m=>{const base=d26State.find(r=>r.m===m)||{m,mq:0,as:0,rM:0,rA:0,co:0,cg:0,op:0};const ns=newSales26[m];return{m,mq:base.mq+ns.mq,as:base.as+ns.as,rM:base.rM+ns.rM,rA:base.rA+ns.rA,co:base.co+ns.co,cg:(base.mq+ns.mq)*2910,op:Math.round((opexByMonth26[m]||0)/tc26g)};});

  // ITBIS and Azul deductions for 2026
  const itbis26=clientsRetro.filter(c=>c.fc>="2026"&&c.itbis>0).reduce((a,c)=>a+c.itbis,0);
  const azul26=clientsRetro.filter(c=>c.fc>="2026"&&c.comAzul>0).reduce((a,c)=>a+c.comAzul,0);

  // Gastos computations (for Gastos tab)
  const gastoTC=tasa;
  const gastoTotalDOP=gastos.reduce((a,g)=>a+g.monto,0);
  const gastoTotalUSD=Math.round(gastoTotalDOP/gastoTC);
  const gastoByMes={};gastos.forEach(g=>{if(!gastoByMes[g.mes])gastoByMes[g.mes]=0;gastoByMes[g.mes]+=g.monto;});
  const gastoByCat={};gastos.forEach(g=>{if(!gastoByCat[g.cat])gastoByCat[g.cat]=0;gastoByCat[g.cat]+=g.monto;});
  const gastoCatColors={"Nómina":DANGER,"Logística":WARN,"Tecnología":BLUE,"Servicios":STEEL,"Seguros":"#F97316","Operativo":"#64748B"};
  const gastoMeses=Object.keys(gastoByMes).sort();
  const gastoPromedioMes=gastoMeses.length>0?gastoTotalDOP/gastoMeses.length:0;

  // Posición actual computations
  const posTc2=tasa;const posFD=n=>`RD$${Math.round(n).toLocaleString()}`;const posFU=n=>`$${Math.round(n).toLocaleString()}`;
  const posCuentas=cuentasState.map(c=>({...c}));
  const posDynCxcTotal=clientsRetro.reduce((a,c)=>a+(c.vta-c.pag>0?c.vta-c.pag:0),0);
  const posCxcDOP=posDynCxcTotal*posTc2;
  const posCxcIdx=posCuentas.findIndex(c=>c.dynamic);if(posCxcIdx>=0)posCuentas[posCxcIdx]={...posCuentas[posCxcIdx],v:posCxcDOP};
  const posTotalDOP=posCuentas.reduce((a,c)=>a+c.v,0);
  const posTotalUSD=Math.round(posTotalDOP/posTc2);
  const posCleanCash=posTotalDOP-posCxcDOP-posCuentas.filter(c=>["Cash físico","Otros activos","Refund pendiente"].includes(c.n)).reduce((a,c)=>a+c.v,0);
  const posCleanUSD=Math.round(posCleanCash/posTc2);
  const posInvBase=39;const posNewMaq=clientsRetro.filter(c=>c.id>134).reduce((a,c)=>a+c.mq,0);const posInvMaq=Math.max(0,posInvBase-posNewMaq);const posNewAses=clients.filter(c=>c.id>134).reduce((a,c)=>a+c.as,0);const posInvAses=Math.max(0,Math.round(posInvMaq*0.5));
  const posRevInv=(posInvMaq*6200+posInvAses*2000)*posTc2;
  const posCxpContainer=12000000;const posOpex3m=gastoTotalDOP;
  const posRevNeto=posRevInv-posCxpContainer-posOpex3m;
  const posPosNeta=posTotalDOP+posRevNeto;
  const posGoal=61500000;const posProjPct=posPosNeta/posGoal*100;
  // Ruta al Millón - dynamic from current position
  const posHoyUSD=posCleanUSD;// Real cash position today
  const netPerMaq=3898;// Net profit per machine all-in
  const opexMoUSD=Math.round(gastoPromedioMes/tc26g);// Monthly OPEX from Gastos tab
  const cxcRecoverUSD=Math.round(posDynCxcTotal);// CxC to recover in May// CxC to recover
  const cxpPayUSD=195000;// Container obligation in May
  const ramp=[{m:"HOY",maq:0,note:"Cash en cuentas",adj:0},{m:"MAR",maq:15,note:"47 pagadas → COGS $0",adj:0},{m:"ABR",maq:16,note:"COGS $0 (inventario)",adj:0},{m:"MAY",maq:17,note:"Cobra CXC, paga container",adj:cxcRecoverUSD-cxpPayUSD},{m:"JUN",maq:18,note:"Setter 2 + ads",adj:0},{m:"JUL",maq:18,note:"2 containers",adj:0},{m:"AGO",maq:19,note:"Recompra + referidos",adj:0},{m:"SEP",maq:20,note:"Velocidad crucero",adj:0},{m:"OCT",maq:20,note:"Q4 estacional",adj:0},{m:"NOV",maq:21,note:"MILLÓN",adj:0}];
  const posMonths=ramp.map((r,i)=>{if(i===0)return{...r,net:0,bal:posHoyUSD};const prev=ramp.slice(0,i).reduce((a,x,j)=>{if(j===0)return posHoyUSD;return a+(ramp[j].maq*netPerMaq)+ramp[j].adj;},0);const net=(r.maq*netPerMaq)+r.adj;const bal=i===1?posHoyUSD+net:0;return{...r,net,bal:0};});
  // Recalculate balances cumulatively
  let runBal=posHoyUSD;posMonths.forEach((m,i)=>{if(i===0){m.bal=posHoyUSD;}else{runBal+=m.net;m.bal=runBal;}});
  const posMaxBal=Math.max(...posMonths.map(m=>m.bal));
  const posCats=["Empresarial","Inversión","Personal","Otros"];
  const posCatTotals=posCats.map(cat=>({cat,total:posCuentas.filter(c=>c.cat===cat).reduce((a,c)=>a+c.v,0)}));

  // Registro de Ventas computations
  const regAll=clientsRetro;
  const regNameCount={};regAll.forEach(c=>{const k=c.ced||c.n;regNameCount[k]=(regNameCount[k]||0)+1;});
  const regIsRec=(c)=>{const k=c.ced||c.n;return regNameCount[k]>1;};
  const regInRange=(c)=>{if(fDesde&&c.fc<fDesde)return false;if(fHasta&&c.fc>fHasta)return false;return true;};
  const regMatchGrupo=(c)=>fGrupo==="all"||c.g===Number(fGrupo);
  const regMatchTipo=(c)=>fTipo==="all"||(fTipo==="ases"?c.as>0:c.as===0);
  const regMatchEmp=(c)=>fEmp==="all"||(fEmp==="empresa"?c.tipo==="Empresa":c.tipo==="PF");
  const regShow=regAll.filter(c=>regInRange(c)&&regMatchGrupo(c)&&regMatchTipo(c)&&regMatchEmp(c));
  const regSMq=regShow.reduce((a,c)=>a+c.mq,0);const regSAs=regShow.reduce((a,c)=>a+c.as,0);
  const regSVta=regShow.reduce((a,c)=>a+c.vta,0);const regSPag=regShow.reduce((a,c)=>a+c.pag,0);
  const regUniqueNames=new Set(regShow.map(c=>c.ced||c.n)).size;
  const regAvgMaq=regUniqueNames>0?(regSMq/regUniqueNames):0;
  const regBriannyCierres=regShow.filter(c=>c.closer==="Brianny");
  const regComClosings=regBriannyCierres.length*100;
  const regDianaAll=regShow.filter(c=>c.setter==="Diana");
  const regDianaAses=regDianaAll.filter(c=>c.as>0);
  const regDianaMaqMarzo=regDianaAll.filter(c=>c.as===0&&c.fc>="2026-03");
  const regComSetting=(regDianaAses.reduce((a,c)=>a+c.as*2000*0.05,0))+(regDianaMaqMarzo.length*50);
  const regGroups=[...new Set(regAll.map(c=>c.g))].sort((a,b)=>a-b);
  const regBdCalc=(ds)=>{if(!ds)return null;const d=new Date(ds);const now=new Date(2026,2,20);let ct=0;const cur=new Date(d);while(cur<now){cur.setDate(cur.getDate()+1);if(cur.getDay()!==0&&cur.getDay()!==6)ct++;}return ct;};
  const data=compute(tab==="E.R. 2025"?d25State:d26dyn);const tot=sumAll(data);
  const ce=tot.tr>0?(tot.co/tot.tr*100):0;const am=tot.tr>0?(tot.np/tot.tr*100):0;const cpm=tot.co>0?(tot.cp/tot.co*100):0;
  // Derive CxC dynamically from clients state
  const dynCxc=clientsRetro.filter(c=>c.vta-c.pag>0).map(c=>{const adeudado=c.vta-c.pag;const daysAgo=Math.floor((new Date(2026,2,20)-new Date(c.fc))/864e5);return{n:c.n,a:adeudado,d:c.fc,o:c.mp==="Link Azul"?"Link de pago":"Al notificar",y:c.fc<"2026"?25:26,days:daysAgo,aging:daysAgo>90?"90+":daysAgo>60?"60-90":daysAgo>30?"30-60":"0-30"};});
  const dynTcxc=dynCxc.reduce((a,c)=>a+c.a,0);const dynTc25=dynCxc.filter(c=>c.y===25).reduce((a,c)=>a+c.a,0);const dynTc26=dynCxc.filter(c=>c.y===26).reduce((a,c)=>a+c.a,0);
  const ag={"0-30":0,"30-60":0,"60-90":0,"90+":0};const agN={"0-30":0,"30-60":0,"60-90":0,"90+":0};
  dynCxc.forEach(c=>{ag[c.aging]+=c.a;agN[c.aging]++;});
  // Derive LTV dynamically from clients
  const nameGroups={};clientsRetro.forEach(c=>{const k=c.ced||c.n;if(!nameGroups[k])nameGroups[k]={n:c.n,purchases:0,mq:0,total:0,first:c.fc,last:c.fc};nameGroups[k].purchases++;nameGroups[k].mq+=c.mq;nameGroups[k].total+=c.vta;if(c.fc<nameGroups[k].first)nameGroups[k].first=c.fc;if(c.fc>nameGroups[k].last)nameGroups[k].last=c.fc;});
  const dynRecurrents=Object.values(nameGroups).filter(g=>g.purchases>1).sort((a,b)=>b.total-a.total);
  const dynTotalRecRev=dynRecurrents.reduce((a,c)=>a+c.total,0);const dynAvgLTV=dynRecurrents.length>0?dynTotalRecRev/dynRecurrents.length:0;
  const dynTotalClients=Object.keys(nameGroups).length;const dynReRate=dynTotalClients>0?(dynRecurrents.length/dynTotalClients*100):0;
  const dynOneTimeLTV=6200+0.58*2000;const dynLtvRatio=dynOneTimeLTV>0?dynAvgLTV/dynOneTimeLTV:0;
  // Derive Garantías dynamically from clients
  const dynWd=clientsRetro.map(cl=>{const dl=cl.fc?Math.floor((new Date(new Date(cl.fc).setFullYear(new Date(cl.fc).getFullYear()+1))-TODAY_REAL)/864e5):null;return{n:cl.n,d:cl.fc,mq:cl.mq,g:cl.g,dl};}).filter(cl=>cl.dl!==null);
  const dynWExp=dynWd.filter(w=>w.dl<0).length;const dynWSoon=dynWd.filter(w=>w.dl>=0&&w.dl<=90).length;const dynWOk=dynWd.filter(w=>w.dl>90).length;
  // Derive Asesorías activas (4 months from first purchase with asesoria)
  const TODAY_REAL=new Date();
  const firstAses={};clientsRetro.filter(cl=>cl.as>0).forEach(cl=>{const k=cl.ced||cl.n;if(!firstAses[k]||cl.fc<firstAses[k].fc)firstAses[k]={fc:cl.fc,nombre:cl.n};});
  const dynAd=Object.entries(firstAses).map(([k,obj])=>{const fechaInicio=asesoriaOverrides[k]||obj.fc;const exp=new Date(fechaInicio);exp.setMonth(exp.getMonth()+4);const dl=Math.floor((exp-TODAY_REAL)/864e5);return{n:obj.nombre,k,fc:obj.fc,fechaInicio,dl};});
  const dynAAct=dynAd.filter(a=>a.dl>=0).length;

  return(
    <div style={{background:DARK,minHeight:"100vh",color:"#E2E8F0",fontFamily:"'Segoe UI',system-ui,sans-serif",overflowX:"hidden"}}><style>{`
@media(max-width:768px){.sd-hdr{flex-direction:column!important;align-items:flex-start!important;gap:6px!important}.sd-nav{flex-wrap:wrap!important;gap:3px!important}.sd-kpis{flex-wrap:wrap!important}.sd-kpis>div{min-width:calc(50% - 4px)!important;flex:none!important}.sd-body{padding:6px 8px!important}.sd-tbl{font-size:7px!important;min-width:unset!important}input,select{font-size:12px!important}}
`}</style>
      <div style={{background:`linear-gradient(135deg,${NAVY},${DARK})`,borderBottom:`2px solid ${BLUE}`,padding:"10px 12px 7px"}}>
        <div className="sd-hdr" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
          <div><img src="https://i.ibb.co/placeholder/logo.png" alt="" style={{height:22,marginRight:6,verticalAlign:"middle"}} onError={e=>{e.target.style.display="none"}}/><span style={{fontSize:8,letterSpacing:3,color:BLUE,fontWeight:700}}>SNACKS DEPOT®</span><span style={{fontSize:14,fontWeight:800,color:"#fff",marginLeft:6}}>Master Dashboard</span><span style={{fontSize:7,color:OK,marginLeft:8,fontWeight:400}}>● Datos guardados</span><span style={{fontSize:7,color:role==="admin"?GOLD:STEEL,marginLeft:6,fontWeight:700,padding:"1px 4px",borderRadius:2,background:role==="admin"?`${GOLD}22`:`${STEEL}22`}}>{role==="admin"?"ADMIN":"ASISTENTE"}</span><button onClick={()=>setRole(null)} style={{marginLeft:4,background:"transparent",color:"#475569",border:"1px solid #334155",borderRadius:2,fontSize:6,padding:"1px 4px",cursor:"pointer"}}>Salir</button>
              <span style={{marginLeft:8,fontSize:7,color:"#94A3B8"}}>TC:</span>
              <input type="number" step="0.01" value={tasa} onChange={e=>setTasa(Number(e.target.value))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:GOLD,fontSize:8,fontWeight:700,padding:"1px 4px",width:45,textAlign:"center",marginLeft:2}}/>
              <span style={{fontSize:7,color:"#475569",marginLeft:2}}>{tasaAuto?`API: ${tasaAuto.toFixed(2)} (${tasaDate})`:"cargando..."}</span>
              {tasaAuto&&Math.abs(tasa-tasaAuto)>0.5&&(<button onClick={()=>setTasa(tasaAuto)} style={{marginLeft:3,background:WARN,color:DARK,border:"none",borderRadius:2,fontSize:6,padding:"1px 4px",cursor:"pointer",fontWeight:700}}>Usar API</button>)}</div>
          <div className="sd-nav" style={{display:"flex",gap:2,flexWrap:"wrap"}}>
            {visibleTabs.map(t=>{const k=t;return(<button key={k} onClick={()=>{setTab(k);setVw("accrual");}} style={{padding:"3px 6px",fontSize:8,fontWeight:700,background:tab===k?BLUE:"transparent",color:tab===k?"#fff":"#94A3B8",border:tab===k?"none":"1px solid #334155",borderRadius:3,cursor:"pointer"}}>{t}</button>);})}
          </div>
        </div>
        {(tab==="E.R. 2025"||tab==="E.R. 2026")&&<div style={{display:"flex",gap:2,marginTop:5}}>
          {[["accrual","Devengado (Accrual)"],["cash","Base de caja (Cash Basis)"],["eff","Eficiencia de cobro"]].map(([v,label])=>(<button key={v} onClick={()=>setVw(v)} style={{padding:"2px 6px",fontSize:7,fontWeight:600,background:vw===v?GOLD:"transparent",color:vw===v?DARK:"#64748B",border:vw===v?"none":"1px solid #334155",borderRadius:3,cursor:"pointer"}}>{label}</button>))}
        </div>}
      </div>
      <div className="sd-body" style={{padding:"8px 12px",maxWidth:960,margin:"0 auto"}}>

        {/* ESTADO DE RESULTADOS */}
        {(tab==="E.R. 2025"||tab==="E.R. 2026")&&<>
          <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
            <K l="Revenue máquinas" v={F(tot.tr-tot.as*2000)} s={`${tot.mq} máquinas`} co={"#fff"}/>
            <K l="Revenue asesorías" v={F(tot.as*2000)} s={`${tot.as} asesorías (${tot.mq>0?(tot.as/tot.mq*100).toFixed(0):0}%)`} co={STEEL}/>
            <K l="Revenue total facturado" v={F(tot.tr)} s={`${tot.mq} máq + ${tot.as} ases`}/>
            <K l="Cobrado en banco" v={F(tot.co)} co={GOLD} s={`Eficiencia: ${PC(ce)}`}/>
            <K l={vw==="cash"?"Ganancia en efectivo":"Ganancia neta"} v={F(vw==="cash"?tot.cp:tot.np)} co={OK} s={`Margen: ${PC(vw==="cash"?cpm:am)}`}/>
            <K l="Pendiente por cobrar" v={F(tab==="E.R. 2025"?dynTc25:dynTc26)} co={DANGER} s={`${dynCxc.filter(c=>c.y===(tab==="E.R. 2025"?25:26)).length} clientes`}/>
          </div>
          {(vw==="cash"||vw==="eff")&&<div style={{background:"#0F172A",borderRadius:6,padding:"6px 10px",marginBottom:8,border:"1px solid #334155"}}>
            <div style={{fontSize:9,color:"#94A3B8",lineHeight:1.5}}>
              <span style={{color:WARN,fontWeight:700}}>Nota de conciliación:</span> El monto cobrado incluye pagos sobre facturas de meses o años anteriores, y el pendiente por cobrar solo refleja saldos abiertos registrados en cobranza. Por eso la suma de ambos no es exactamente igual al revenue facturado. {tab==="E.R. 2026"&&"Además, marzo de 2026 aún no ha cerrado y algunas ventas recientes no se han registrado todavía en el módulo de cobranza."}
            </div>
          </div>}
          <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{background:NAVY}}>
                <th style={th}>Mes</th><th style={th}>Máq</th><th style={th}>Ases</th><th style={thr}>Rev. máq</th><th style={thr}>Rev. ases</th><th style={thr}>Total rev.</th>
                {(vw==="cash"||vw==="eff")&&<th style={thr}>Cobrado</th>}
                {vw!=="eff"&&<><th style={thr}>Costo merc.</th><th style={thr}>Gastos fijos</th></>}
                <th style={thr}>{vw==="cash"?"Ganancia caja":vw==="eff"?"Eficiencia":"Ganancia neta"}</th>
                <th style={thr}>{vw==="eff"?"Brecha":"Margen"}</th>
              </tr></thead>
              <tbody>
                {data.map((d,i)=>{const pv=vw==="cash"?d.cp:d.np;const mv=vw==="cash"?(d.co>0?d.cp/d.co*100:0):d.mg;return(
                  <tr key={i} style={{borderBottom:"1px solid #334155"}}>
                    <td style={{...td,fontWeight:700}}>{d.m}</td><td style={tdc}>{d.mq}</td><td style={tdc}>{d.as}</td>
                    <td style={tdr}>{F(d.rM)}</td><td style={tdr}>{F(d.rA)}</td><td style={{...tdr,fontWeight:600}}>{F(d.tr)}</td>
                    {(vw==="cash"||vw==="eff")&&<td style={{...tdr,color:d.ce>=90?OK:d.ce>=70?WARN:DANGER}}>{F(d.co)}</td>}
                    {vw!=="eff"&&<><td style={tdr}>{F(d.cg)}</td><td style={tdr}>{F(d.op)}</td></>}
                    <td style={{...tdr,fontWeight:700,color:vw==="eff"?(d.ce>=90?OK:d.ce>=70?WARN:DANGER):(pv>0?OK:DANGER)}}>{vw==="eff"?PC(d.ce):F(pv)}</td>
                    <td style={{...tdr,fontSize:9,color:vw==="eff"?WARN:(mv>50?OK:mv>30?WARN:DANGER)}}>{vw==="eff"?F(d.tr-d.co):PC(mv)}</td>
                  </tr>);})}
                <tr style={{background:"#0F172A",fontWeight:700}}>
                  <td style={td}>Total</td><td style={tdc}>{tot.mq}</td><td style={tdc}>{tot.as}</td>
                  <td style={tdr}>{F(data.reduce((a,d)=>a+d.rM,0))}</td><td style={tdr}>{F(data.reduce((a,d)=>a+d.rA,0))}</td><td style={{...tdr,fontWeight:700}}>{F(tot.tr)}</td>
                  {(vw==="cash"||vw==="eff")&&<td style={{...tdr,color:GOLD}}>{F(tot.co)}</td>}
                  {vw!=="eff"&&<><td style={tdr}>{F(tot.cg)}</td><td style={tdr}>{F(tot.op)}</td></>}
                  <td style={{...tdr,color:OK}}>{vw==="eff"?PC(ce):F(vw==="cash"?tot.cp:tot.np)}</td>
                  <td style={{...tdr,fontSize:9}}>{vw==="eff"?F(tot.tr-tot.co):PC(vw==="cash"?cpm:am)}</td>
                </tr>
                <tr style={{background:"#0F172A",borderTop:"1px dashed #475569"}}>
                  <td style={{...td,fontSize:9,color:GOLD}}>Promedio/mes</td>
                  <td style={{...tdc,fontSize:9,color:GOLD}}>{(tot.mq/data.length).toFixed(1)}</td>
                  <td style={{...tdc,fontSize:9,color:GOLD}}>{(tot.as/data.length).toFixed(1)}</td>
                  <td style={{...tdr,fontSize:9,color:"#94A3B8"}}>{F(data.reduce((a,d)=>a+d.rM,0)/data.length)}</td>
                  <td style={{...tdr,fontSize:9,color:"#94A3B8"}}>{F(data.reduce((a,d)=>a+d.rA,0)/data.length)}</td>
                  <td style={{...tdr,fontSize:9,color:GOLD}}>{F(tot.tr/data.length)}</td>
                  {(vw==="cash"||vw==="eff")&&<td style={{...tdr,fontSize:9,color:GOLD}}>{F(tot.co/data.length)}</td>}
                  {vw!=="eff"&&<><td style={{...tdr,fontSize:9,color:"#94A3B8"}}>{F(tot.cg/data.length)}</td><td style={{...tdr,fontSize:9,color:"#94A3B8"}}>{F(tot.op/data.length)}</td></>}
                  <td style={{...tdr,fontSize:9,color:GOLD}}>{vw==="eff"?PC(ce):F((vw==="cash"?tot.cp:tot.np)/data.length)}</td>
                  <td style={{...tdr,fontSize:8,color:"#64748B"}}>{data.length} meses</td>
                </tr>
              </tbody>
            </table></div>
          </div>

          {/* QUARTERLY BREAKDOWN */}
          <QuarterlyView data={data} vw={vw}/>

          {/* COGS + ANALYSIS PANEL */}
          <Inf color={GOLD}>
            <div style={{fontSize:10,fontWeight:700,color:GOLD,marginBottom:8}}>Detalle de costos y análisis de márgenes</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div style={{background:"#1E293B",borderRadius:6,padding:10}}>
                <div style={{fontSize:10,fontWeight:700,color:"#fff",marginBottom:6}}>Costo por máquina: $2,910 USD</div>
                <div style={{fontSize:10,color:"#94A3B8",lineHeight:1.7}}>
                  <span style={{color:GOLD}}>▸</span> Adelanto a fábrica (63%): ~$1,833<br/>
                  <span style={{color:GOLD}}>▸</span> Saldo al arribo (37%): ~$677<br/>
                  <span style={{color:GOLD}}>▸</span> Aduanas y desaduanización: ~$400<br/>
                  <span style={{color:GOLD}}>▸</span> Total landed: RD$178,938 / TC 61.5 = $2,910<br/>
                  <span style={{color:WARN}}>▸</span> Excepción marzo 2025: RD$240,000 / TC 62.15 = $3,862 por máquina (costo más alto al inicio por volumen menor)<br/>
                  <span style={{color:"#64748B"}}>Fuente: análisis de unit economics, Sept 2025. Tasa marzo: Banco Central RD.</span>
                </div>
              </div>
              <div style={{background:"#1E293B",borderRadius:6,padding:10}}>
                <div style={{fontSize:10,fontWeight:700,color:"#fff",marginBottom:6}}>Gastos fijos mensuales</div>
                <div style={{fontSize:10,color:"#94A3B8",lineHeight:1.7}}>
                  <span style={{color:BLUE}}>▸</span> Marzo 2025: $0 (sin gastos fijos al inicio)<br/>
                  <span style={{color:BLUE}}>▸</span> Mayo a agosto 2025: $3,100 por mes<br/>
                  <span style={{color:BLUE}}>▸</span> Septiembre a diciembre 2025: $7,805 por mes<br/>
                  <span style={{color:BLUE}}>▸</span> 2026: $10,407 por mes (RD$640,000 real)<br/>
                  <span style={{color:BLUE}}>▸</span> Incluye: salarios, oficina, entregas, transporte, herramientas, ManyChat<br/>
                  <span style={{color:BLUE}}>▸</span> No incluye anuncios pagados (aún no activados)
                </div>
              </div>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:6}}>
              {vw==="cash"?"Análisis de caja":"Análisis de resultados"} — {tab}
            </div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              {vw==="cash"&&tab==="E.R. 2026"&&<>
                En el primer trimestre de 2026 se vendieron 38 máquinas. El costo de adquisición de estas máquinas se distribuyó entre los pagos realizados en meses anteriores. El adelanto a fábrica (63% del costo) se pagó cuando se ordenó el container en 2025, y el saldo al arribo (37%) más las aduanas forman parte del CxP de ~RD$12 millones que aún está pendiente de liquidar, con fecha estimada de pago en mayo de 2026.
                <br/><br/>
                <span style={{color:WARN}}>La eficiencia de cobro bajó a {PC(ce)}.</span> De los {F(tot.tr)} facturados, solo entraron {F(tot.co)} al banco. La brecha de {F(tot.tr-tot.co)} corresponde a clientes que pactaron pagar al notificar la llegada de su máquina o que tienen planes de pago parciales. Esta política está erosionando el flujo de caja real del negocio.
                <br/><br/>
                <span style={{color:"#94A3B8"}}>Nota importante:</span> El cobro de enero incluye aproximadamente $10,500 que corresponden a facturas de 2025 (pagos finales de Ely Cruz, Natanelle, Wilner, Augusto y Cynthia). Estos inflan ligeramente el efectivo recibido en enero pero pertenecen al revenue del año anterior.
              </>}
              {vw==="cash"&&tab==="E.R. 2025"&&<>
                En 2025 se cobró {F(sumAll(compute(d25State)).co)} de un total facturado de {F(sumAll(compute(d25State)).tr)}, lo que equivale a una eficiencia de cobro del {PC(sumAll(compute(d25State)).co/sumAll(compute(d25State)).tr*100)}. La mayoría de los clientes pagaron al contado o completaron sus pagos en plazos cortos. Solo quedaron pendientes ~$28,000 al cierre de diciembre. La ganancia en efectivo fue de {F(sumAll(compute(d25State)).cp)} con un margen sobre cobrado del {PC(sumAll(compute(d25State)).cp/sumAll(compute(d25State)).co*100)}.
              </>}
              {vw==="accrual"&&tab==="E.R. 2026"&&<>
                El primer trimestre de 2026 cerró con un revenue total de {F(tot.tr)} proveniente de {tot.mq} máquinas y {tot.as} asesorías. El costo de mercancía vendida, calculado a $2,910 por máquina, sumó {F(tot.cg)}. Los gastos fijos de tres meses totalizaron {F(tot.op)}.
                <br/><br/>
                <span style={{color:OK}}>La ganancia neta fue de {F(tot.np)} con un margen del {PC(am)}.</span>
                <br/><br/>
                <span style={{color:WARN}}>Sin embargo, hay una tendencia preocupante:</span> enero fue el mejor mes con 18 máquinas y una tasa de asesoría del 58%, generando $73,000 de ganancia neta. Febrero cayó a 11 máquinas y marzo a solo 9. La tasa de asesoría se mantuvo alta (~58%), pero el volumen de ventas bajó significativamente. Sin intervención (segundo setter, anuncios, campaña de recompra), el segundo trimestre no alcanzará el ritmo necesario para la ruta al millón.
              </>}
              {vw==="accrual"&&tab==="E.R. 2025"&&<>
                El 2025 cerró con {F(tot.tr)} en revenue sobre {tot.mq} máquinas y {tot.as} asesorías en 9 meses de operación. La ganancia neta fue de {F(tot.np)}, equivalente a un margen del {PC(am)}. El mejor mes en revenue fue septiembre con $142,000 y 20 máquinas. Diciembre fue el pico de volumen con 25 máquinas vendidas, aunque con margen ligeramente menor por la mezcla de producto (más máquinas sin asesoría).
              </>}
              {vw==="eff"&&<>
                {tab==="E.R. 2026"?<>La eficiencia de cobro del primer trimestre de 2026 fue: enero {PC(data[0]?.ce||0)}, febrero {PC(data[1]?.ce||0)} y marzo {PC(data[2]?.ce||0)} (parcial, el mes aún no cierra). La brecha total sin cobrar es de {F(tot.tr-tot.co)}. De 24 transacciones realizadas, 11 tienen saldo pendiente. Las causas principales son: la política flexible de pagar al notificar la llegada, clientes con pagos en 2 o 3 cuotas sin contrato formal, y un caso extremo (Rodrigo) que pagó solo $1,000 de $12,400.</>:<>El 2025 cerró con una eficiencia de cobro promedio del {PC(ce)}. Los meses más fuertes fueron septiembre y octubre, donde se cobraron incluso pagos adelantados. Noviembre y diciembre bajaron por el incremento de ventas con pago diferido al notificar la llegada del container.</>}
              </>}
            </div>
          </Inf>
        </>}

        {/* ===== TAB REGISTRO DE VENTAS ===== */}
        {tab==="Registro de Ventas"&&(
            <>
              {/* FILTERS */}
              <div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <span style={{fontSize:7,color:"#64748B"}}>Desde</span>
                  <input type="date" value={fDesde} onChange={e=>setFDesde(e.target.value)} style={{background:"#1E293B",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:8,padding:"2px 4px"}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <span style={{fontSize:7,color:"#64748B"}}>Hasta</span>
                  <input type="date" value={fHasta} onChange={e=>setFHasta(e.target.value)} style={{background:"#1E293B",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:8,padding:"2px 4px"}}/>
                </div>
                <select value={fGrupo} onChange={e=>setFGrupo(e.target.value)} style={{background:"#1E293B",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:8,padding:"2px 4px"}}>
                  <option value="all">Todos los grupos</option>
                  {regGroups.map(g=>(<option key={g} value={g}>Grupo {g}</option>))}
                </select>
                <select value={fTipo} onChange={e=>setFTipo(e.target.value)} style={{background:"#1E293B",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:8,padding:"2px 4px"}}>
                  <option value="all">Todas las ventas</option>
                  <option value="ases">Maq. + Asesoría</option>
                  <option value="maq">Solo Máquina</option>
                </select>
                <select value={fEmp} onChange={e=>setFEmp(e.target.value)} style={{background:"#1E293B",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:8,padding:"2px 4px"}}>
                  <option value="all">PF + Empresa</option>
                  <option value="empresa">Solo Empresas</option>
                  <option value="pf">Solo Persona Física</option>
                </select>
                {(fDesde||fHasta||fGrupo!=="all"||fTipo!=="all"||fEmp!=="all")&&(
                  <button onClick={()=>{setFDesde("");setFHasta("");setFGrupo("all");setFTipo("all");setFEmp("all");}} style={{background:DANGER,color:"#fff",border:"none",borderRadius:3,fontSize:7,padding:"2px 6px",cursor:"pointer",fontWeight:700}}>Limpiar filtros</button>
                )}
                <button onClick={()=>setShowForm(!showForm)} style={{background:showForm?DANGER:OK,color:"#fff",border:"none",borderRadius:3,fontSize:8,padding:"3px 8px",cursor:"pointer",fontWeight:700,marginLeft:"auto"}}>{showForm?"Cancelar":"+ Nuevo Cliente"}</button>
              </div>
              {/* FORM */}
              {showForm&&(
                <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${OK}44`,padding:12,marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:OK,marginBottom:8}}>Nuevo registro de venta</div>
                  {formErr&&<div style={{background:`${DANGER}22`,color:DANGER,padding:"4px 8px",borderRadius:4,fontSize:9,marginBottom:6,fontWeight:700}}>{formErr}</div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginBottom:8}}>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Cédula/RNC *</label><input value={nc.ced} onChange={e=>setNc({...nc,ced:e.target.value})} style={{background:"#0F172A",border:`1px solid ${nc.ced?"#334155":DANGER}`,borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}} placeholder="000-0000000-0"/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Nombre *</label><input value={nc.n} onChange={e=>setNc({...nc,n:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}} placeholder="Nombre completo"/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Tipo</label><select value={nc.tipo} onChange={e=>{const t=e.target.value;setNc(p=>({...p,tipo:t,itbis:(t==="Empresa"||p.mp==="Link Azul")?Math.round(p.vta*0.18*100)/100:0,factura:t==="Empresa"?"B01":(p.mp==="Link Azul"?"B02":"")}));}} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option value="PF">Persona Física</option><option value="Empresa">Empresa</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Empresa</label><input value={nc.emp} onChange={e=>setNc({...nc,emp:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}} placeholder="Si aplica"/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Medio pago</label><select value={nc.mp} onChange={e=>{const mp=e.target.value;setNc(p=>({...p,mp,comAzul:mp==="Link Azul"?Math.round(p.vta*0.0395*100)/100:0,itbis:(p.tipo==="Empresa"||mp==="Link Azul")?Math.round(p.vta*0.18*100)/100:0,factura:p.tipo==="Empresa"?"B01":(mp==="Link Azul"?"B02":p.factura)}));}} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option>Transferencia</option><option>Depósito</option><option>Link Azul</option><option>Financiamiento</option></select></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:6,marginBottom:8}}>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>F. compra *</label><input type="date" value={nc.fc} onChange={e=>setNc({...nc,fc:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>F. entrega</label><input type="date" value={nc.fe} onChange={e=>setNc({...nc,fe:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Máquinas</label><input type="number" min="1" value={nc.mq} onChange={e=>{const m=Number(e.target.value);setNc(p=>({...p,mq:m,vta:m*6200+p.as*2000}));}} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Asesorías</label><input type="number" min="0" value={nc.as} onChange={e=>{const a=Number(e.target.value);setNc(p=>({...p,as:a,compra:a>0?"Maq. + Asesoria":"Maquina",vta:p.mq*6200+a*2000}));}} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Venta USD</label><input type="number" value={nc.vta} onChange={e=>setNc({...nc,vta:Number(e.target.value)})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Pagado</label><input type="number" value={nc.pag} onChange={e=>setNc({...nc,pag:Number(e.target.value)})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:8}}>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Moneda</label><select value={nc.mon} onChange={e=>setNc({...nc,mon:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option>USD</option><option>DOP</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Tasa</label><input type="number" step="0.01" value={nc.tasa||tasa} onChange={e=>setNc({...nc,tasa:Number(e.target.value)})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Grupo</label><input type="number" min="1" value={nc.g} onChange={e=>setNc({...nc,g:Number(e.target.value)})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Closer</label><select value={nc.closer} onChange={e=>setNc({...nc,closer:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option>Brianny</option><option>Ulises</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Setter</label><select value={nc.setter} onChange={e=>setNc({...nc,setter:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option value="">—</option><option>Diana</option><option>Brianny</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Cuenta destino</label><select value={nc.cuenta||""} onChange={e=>setNc({...nc,cuenta:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option value="">—</option><option>Popular BIZ DOP</option><option>Popular BIZ USD</option><option>Santa Cruz DOP</option><option>Santa Cruz USD</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Grupo compra</label><select value={nc.grupo} onChange={e=>setNc({...nc,grupo:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option>Solo</option><option>Pareja</option><option>Socio</option><option>Familiar</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Referido por</label><input value={nc.ref||""} onChange={e=>setNc({...nc,ref:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}} placeholder="Nombre del referidor"/></div>
                  </div>
                  <div style={{display:"flex",justifyContent:"flex-end",gap:4}}>
                    <button onClick={()=>{setShowForm(false);setNc(emptyC);setFormErr("");}} style={{background:"transparent",color:"#64748B",border:"1px solid #334155",borderRadius:3,fontSize:8,padding:"4px 12px",cursor:"pointer"}}>Cancelar</button>
                    <button onClick={()=>{if(!nc.ced.trim()){setFormErr("Cédula/RNC es obligatorio");return;}if(!nc.n.trim()){setFormErr("Nombre es obligatorio");return;}if(!nc.fc){setFormErr("Fecha de compra es obligatoria");return;}const newId=Math.max(...clients.map(c=>c.id),0)+1;setClients(prev=>[...prev,{...nc,id:newId,tasa:nc.tasa||tasa,itbis:(nc.tipo==="Empresa"||nc.mp==="Link Azul")?Math.round(nc.vta*0.18*100)/100:0,comAzul:nc.mp==="Link Azul"?Math.round(nc.vta*0.0395*100)/100:0,factura:nc.tipo==="Empresa"?"B01":(nc.mp==="Link Azul"?"B02":"")}]);setShowForm(false);setNc(emptyC);setFormErr("");}} style={{background:OK,color:"#fff",border:"none",borderRadius:4,fontSize:9,padding:"5px 16px",cursor:"pointer",fontWeight:700}}>Guardar registro</button>
                  </div>
                </div>
              )}
              {/* KPIs */}
              <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
                <K l="Clientes" v={regUniqueNames} co={"#fff"} s={`Prom: ${regAvgMaq.toFixed(1)} máq/cliente`}/>
                <K l="Máquinas" v={regSMq} co={STEEL} s={`${regSAs} asesorías (${regShow.length>0?(regSAs/regShow.length*100).toFixed(0):0}%)`}/>
                <K l="Ventas totales" v={F(regSVta)} co={GOLD} s={`Cobrado: ${F(regSPag)}`}/>
                <K l="Adeudado" v={F(regSVta-regSPag)} co={regSVta-regSPag>0?DANGER:OK} s={`Eficiencia: ${regSVta>0?(regSPag/regSVta*100).toFixed(1):100}%`}/>
                <K l="Comisión por Closings" v={F(regComClosings)} co={WARN} s={`${regBriannyCierres.length} cierres · $100/cierre`}/>
                <K l="Com. Azul descontada" v={F(totalComAzul)} co={"#F97316"} s={`${clientsRetro.filter(c=>c.comAzul>0).length} pagos · 3.95%`}/>
                <K l="ITBIS 18% a reportar" v={F(totalITBIS)} co={WARN} s={`${clientsRetro.filter(c=>c.itbis>0).length} empresas · tentativo`}/>
                <K l="Comisión por Setting" v={F(regComSetting)} co={BLUE} s={`${regDianaAses.length} ases 5% + ${regDianaMaqMarzo.length} máq $50`}/>
              </div>
              {/* TABLE */}
              <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden"}}>
                <div style={{padding:"5px 8px",background:NAVY,fontSize:8,fontWeight:700,color:GOLD,display:"flex",justifyContent:"space-between"}}>
                  <span>Registro de Ventas — {regShow.length} transacciones · {regSMq} máquinas · {regUniqueNames} clientes</span>
                  <span style={{color:"#64748B",fontSize:7}}>Scroll → para ver todos los campos</span>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:8,minWidth:1400}}>
                    <thead><tr style={{background:"#0F172A"}}>
                      <th style={{...th,position:"sticky",left:0,background:"#0F172A",zIndex:2,width:18}}>#</th>
                      <th style={{...th,position:"sticky",left:18,background:"#0F172A",zIndex:2,minWidth:150}}>Cliente</th>
                      <th style={th}>Cédula/RNC</th><th style={th}>Tipo</th><th style={th}>Empresa</th>
                      <th style={thr}>Máq</th><th style={thr}>Ases</th><th style={th}>Tipo compra</th>
                      <th style={thr}>Venta USD</th><th style={thr}>Pagado</th><th style={th}>Moneda</th><th style={thr}>Tasa</th><th style={thr}>Adeudado</th>
                      <th style={th}>Medio pago</th><th style={th}>F.compra</th><th style={th}>F.entrega</th>
                      <th style={thr}>Días háb.</th><th style={th}>Closer</th><th style={th}>Setter</th>
                      <th style={th}>Grupo</th><th style={th}>Grupo compra</th><th style={thr}>ITBIS</th><th style={th}>Com. Azul</th><th style={th}>Factura</th><th style={th}>Cuenta</th><th style={{...th,width:50}}>Acción</th>
                    </tr></thead>
                    <tbody>{regShow.map((c,i)=>{
                      const adeudado=c.vta-c.pag;
                      const adCo=adeudado>500?DANGER:adeudado>0?WARN:OK;
                      const bg=adeudado>500?"#1a1520":"#1E293B";
                      const rec=regIsRec(c);
                      const dias=regBdCalc(c.fc);
                      return (
                        <tr key={c.id} style={{borderBottom:"1px solid #334155",background:adeudado>500?"#1a1520":undefined}}>
                          <td style={{...tdc,position:"sticky",left:0,background:bg,zIndex:1,fontSize:7,color:"#64748B"}}>{c.id}</td>
                          <td style={{...td,position:"sticky",left:18,background:bg,zIndex:1,fontWeight:600,fontSize:9}}>
                            {rec&&(<span title="Cliente recurrente" style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:GOLD,marginRight:3,verticalAlign:"middle"}}/>)}
                            {editId===c.id?(<input value={c.n} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,n:e.target.value}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:9,padding:"1px 3px",width:120}}/>):c.n}
                          </td>
                          <td style={{...td,color:c.ced?"#E2E8F0":"#EF4444",fontSize:7,fontWeight:c.ced?400:700}}>{editId===c.id?(<input value={c.ced} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,ced:e.target.value}:x))} style={{background:"#0F172A",border:`1px solid ${c.ced?"#334155":DANGER}`,borderRadius:2,color:"#E2E8F0",fontSize:7,padding:"1px 3px",width:90}}/>):(c.ced||"REQUERIDO")}</td>
                          <td style={td}><span style={{fontSize:7,padding:"1px 3px",borderRadius:2,background:c.tipo==="Empresa"?`${BLUE}22`:`${STEEL}22`,color:c.tipo==="Empresa"?BLUE:STEEL}}>{c.tipo}</span></td>
                          <td style={{...td,fontSize:7,color:c.emp?"#E2E8F0":"#334155"}}>{editId===c.id?(<input value={c.emp} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,emp:e.target.value}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:7,padding:"1px 3px",width:100}}/>):(c.emp||"—")}</td>
                          <td style={{...tdc,fontWeight:700}}>{c.mq}</td>
                          <td style={tdc}>{c.as}</td>
                          <td style={{...td,fontSize:7,color:c.compra.includes("Ases")?OK:"#94A3B8"}}>{c.compra}</td>
                          <td style={{...tdr,fontWeight:600}}>{editId===c.id?(<input type="number" value={c.vta} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,vta:Number(e.target.value)}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:8,padding:"2px 3px",width:60,textAlign:"right"}}/>):F(c.vta)}</td>
                          <td style={{...tdr,color:GOLD}}>{editId===c.id?(<input type="number" value={c.pag} onChange={e=>{const v=Number(e.target.value);setClients(prev=>prev.map(x=>x.id===c.id?{...x,pag:v}:x));}} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:GOLD,fontSize:8,padding:"2px 3px",width:60,textAlign:"right"}}/>):F(c.pag)}</td>
                          <td style={{...tdc,fontSize:7}}>{editId===c.id?(<select value={c.mon} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,mon:e.target.value}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:7,padding:"1px",width:45}}><option>USD</option><option>DOP</option></select>):c.mon}</td>
                          <td style={{...tdr,fontSize:7,color:"#94A3B8"}}>{editId===c.id?(<input type="number" step="0.01" value={c.tasa} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,tasa:Number(e.target.value)}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#94A3B8",fontSize:7,padding:"1px 2px",width:50,textAlign:"right"}}/>):(c.tasa>0?c.tasa.toFixed(2):"—")}</td>
                          <td style={{...tdr,color:adCo,fontWeight:adeudado>0?700:400}}>{adeudado>0?F(adeudado):"$0"}</td>
                          <td style={{...td,fontSize:7}}>{c.mp}</td>
                          <td style={{...td,fontSize:7,color:"#94A3B8"}}>{c.fc}</td>
                          <td style={{...td,fontSize:7,color:c.fe?"#94A3B8":"#334155"}}>{editId===c.id?(<input type="date" value={c.fe} onChange={e=>setClients(prev=>prev.map(x=>x.id===c.id?{...x,fe:e.target.value}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:7,padding:"1px 2px",width:90}}/>):(c.fe||"Pend.")}</td>
                          <td style={{...tdr,fontSize:8,color:"#94A3B8"}}>{dias!==null?dias:"—"}</td>
                          <td style={{...td,fontSize:7}}>{c.closer||"—"}</td>
                          <td style={{...td,fontSize:7}}>{c.setter||"—"}</td>
                          <td style={tdc}>{c.g>0?(<span style={{fontSize:7,padding:"1px 3px",borderRadius:2,background:`${GOLD}22`,color:GOLD}}>G{c.g}</span>):"—"}</td>
                          <td style={{...td,fontSize:7}}>{c.grupo}</td>
                          <td style={{...tdr,fontSize:7,color:c.itbis>0?WARN:"#334155"}}>{c.itbis>0?F(c.itbis):"—"}</td>
                          <td style={{...tdr,fontSize:7,color:c.comAzul>0?"#F97316":"#334155"}}>{c.comAzul>0?F(c.comAzul):"—"}</td>
                          <td style={{...td,fontSize:7}}>{c.factura?(<span style={{padding:"1px 3px",borderRadius:2,background:c.factura==="B01"?`${BLUE}22`:`${STEEL}22`,color:c.factura==="B01"?BLUE:STEEL,fontWeight:700}}>{c.factura}</span>):"—"}</td>
                          <td style={{...td,fontSize:7,color:"#64748B"}}>{c.cuenta||"—"}</td>
                          <td style={tdc}>{editId===c.id?(<button onClick={()=>setEditId(null)} style={{background:OK,color:"#fff",border:"none",borderRadius:2,fontSize:7,padding:"2px 4px",cursor:"pointer"}}>OK</button>):(<button onClick={()=>setEditId(c.id)} style={{background:"transparent",color:"#64748B",border:"1px solid #334155",borderRadius:2,fontSize:7,padding:"1px 4px",cursor:"pointer"}}>Editar</button>)}</td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            </>
        )}


        {/* GASTOS */}
        {tab==="Gastos"&&(
            <>
              <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
                <K l="OPEX acumulado 2026" v={`RD$${Math.round(gastoTotalDOP).toLocaleString()}`} co={WARN} s={`~$${gastoTotalUSD.toLocaleString()} USD`}/>
                <K l="Promedio mensual" v={`RD$${Math.round(gastoPromedioMes).toLocaleString()}`} co={STEEL} s={`~$${Math.round(gastoPromedioMes/gastoTC).toLocaleString()} USD/mes`}/>
                <K l="Meses registrados" v={gastoMeses.length} co={"#fff"} s={gastoMeses.map(m=>m.slice(5)).join(", ")}/>
                <K l="Partidas" v={gastos.length} co={"#64748B"} s={`${Object.keys(gastoByCat).length} categorías`}/>
              </div>
              <div style={{display:"flex",gap:3,marginBottom:8,flexWrap:"wrap"}}>
                {Object.entries(gastoByCat).sort((a,b)=>b[1]-a[1]).map(([cat,total],i)=>(
                  <div key={i} style={{flex:1,minWidth:100,background:"#0F172A",borderRadius:5,padding:6,borderTop:`3px solid ${gastoCatColors[cat]||STEEL}`}}>
                    <div style={{fontSize:7,color:"#64748B"}}>{cat}</div>
                    <div style={{fontSize:13,fontWeight:800,color:gastoCatColors[cat]||STEEL}}>RD${Math.round(total).toLocaleString()}</div>
                    <div style={{fontSize:7,color:"#475569"}}>{gastoTotalDOP>0?(total/gastoTotalDOP*100).toFixed(0):0}%</div>
                    <div style={{marginTop:2}}><Bar v={total} mx={gastoTotalDOP*0.4} co={gastoCatColors[cat]||STEEL}/></div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}>
                <button onClick={()=>setShowGastoForm(!showGastoForm)} style={{background:showGastoForm?DANGER:OK,color:"#fff",border:"none",borderRadius:3,fontSize:8,padding:"3px 8px",cursor:"pointer",fontWeight:700}}>{showGastoForm?"Cancelar":"+ Nuevo gasto"}</button>
              </div>
              {showGastoForm&&(
                <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${OK}44`,padding:12,marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:OK,marginBottom:8}}>Registrar gasto</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginBottom:8}}>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Categoría</label><select value={newGasto.cat} onChange={e=>setNewGasto({...newGasto,cat:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}><option>Nómina</option><option>Logística</option><option>Tecnología</option><option>Servicios</option><option>Seguros</option><option>Operativo</option></select></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Concepto *</label><input value={newGasto.concepto} onChange={e=>setNewGasto({...newGasto,concepto:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}} placeholder="Descripción"/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Monto RD$</label><input type="number" value={newGasto.monto} onChange={e=>setNewGasto({...newGasto,monto:Number(e.target.value)})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div><label style={{fontSize:7,color:"#94A3B8",display:"block",marginBottom:1}}>Mes</label><input type="month" value={newGasto.mes} onChange={e=>setNewGasto({...newGasto,mes:e.target.value})} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:3,color:"#E2E8F0",fontSize:9,padding:"4px 6px",width:"100%"}}/></div>
                    <div style={{display:"flex",alignItems:"flex-end"}}><button onClick={()=>{if(!newGasto.concepto.trim())return;const nid=Math.max(...gastos.map(g=>g.id),0)+1;setGastos(prev=>[...prev,{...newGasto,id:nid}]);setNewGasto({cat:"Operativo",concepto:"",monto:0,mes:"2026-03",rec:false});setShowGastoForm(false);}} style={{background:OK,color:"#fff",border:"none",borderRadius:4,fontSize:9,padding:"5px 12px",cursor:"pointer",fontWeight:700,width:"100%"}}>Guardar</button></div>
                  </div>
                </div>
              )}
              {gastoMeses.map(mes=>{
                const mesGastos=gastos.filter(g=>g.mes===mes);
                const mesTotal=mesGastos.reduce((a,g)=>a+g.monto,0);
                const mesLabel={"01":"Enero","02":"Febrero","03":"Marzo","04":"Abril","05":"Mayo","06":"Junio","07":"Julio","08":"Agosto","09":"Septiembre","10":"Octubre","11":"Noviembre","12":"Diciembre"}[mes.slice(5)]||mes;
                return (
                  <div key={mes} style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden",marginBottom:6}}>
                    <div style={{padding:"5px 8px",background:NAVY,fontSize:8,fontWeight:700,color:GOLD,display:"flex",justifyContent:"space-between"}}>
                      <span>{mesLabel} 2026 — {mesGastos.length} partidas</span>
                      <span>RD${Math.round(mesTotal).toLocaleString()} · ~${Math.round(mesTotal/gastoTC).toLocaleString()} USD</span>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                      <thead><tr style={{background:"#0F172A"}}><th style={th}>Categoría</th><th style={th}>Concepto</th><th style={thr}>Monto RD$</th><th style={thr}>~USD</th><th style={thr}>%</th><th style={{...th,width:50}}>Acción</th></tr></thead>
                      <tbody>{mesGastos.map((g,i)=>(
                        <tr key={g.id} style={{borderBottom:"1px solid #334155"}}>
                          <td style={td}><span style={{fontSize:7,padding:"1px 3px",borderRadius:2,background:`${gastoCatColors[g.cat]||STEEL}22`,color:gastoCatColors[g.cat]||STEEL}}>{g.cat}</span></td>
                          <td style={td}>{editGastoId===g.id?(<input value={g.concepto} onChange={e=>setGastos(prev=>prev.map(x=>x.id===g.id?{...x,concepto:e.target.value}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:9,padding:"2px 4px",width:120}}/>):g.concepto}</td>
                          <td style={tdr}>{editGastoId===g.id?(<input type="number" value={g.monto} onChange={e=>setGastos(prev=>prev.map(x=>x.id===g.id?{...x,monto:Number(e.target.value)}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:9,padding:"2px 4px",width:70,textAlign:"right"}}/>):`RD$${Math.round(g.monto).toLocaleString()}`}</td>
                          <td style={{...tdr,color:"#94A3B8"}}>${Math.round(g.monto/gastoTC).toLocaleString()}</td>
                          <td style={{...tdr,fontSize:8,color:"#64748B"}}>{mesTotal>0?(g.monto/mesTotal*100).toFixed(0):0}%</td>
                          <td style={tdc}>{editGastoId===g.id?(<button onClick={()=>setEditGastoId(null)} style={{background:OK,color:"#fff",border:"none",borderRadius:2,fontSize:7,padding:"2px 4px",cursor:"pointer"}}>OK</button>):(<button onClick={()=>setEditGastoId(g.id)} style={{background:"transparent",color:"#64748B",border:"1px solid #334155",borderRadius:2,fontSize:7,padding:"1px 4px",cursor:"pointer"}}>Editar</button>)}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                );
              })}
            </>
        )}

        {/* CUENTAS POR COBRAR */}
        {tab==="Cobranza"&&<>
          <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}} className="sd-kpis">
            <K l="Total adeudado" v={F(dynTcxc)} co={DANGER} s={`${dynCxc.length} clientes`}/>
            <K l="Adeudado 2025" v={F(dynTc25)} co={WARN} s={`${dynCxc.filter(c=>c.y===25).length} clientes`}/>
            <K l="Adeudado 2026" v={F(dynTc26)} co={DANGER} s={`${dynCxc.filter(c=>c.y===26).length} clientes`}/>
            <K l="Deuda más alta" v={dynCxc.length>0?F(Math.max(...dynCxc.map(c=>c.a))):"$0"} co={DANGER} s={dynCxc.length>0?[...dynCxc].sort((a,b)=>b.a-a.a)[0].n:"—"}/>
          </div>
          <div style={{display:"flex",gap:3,marginBottom:8}}>
            {[["0 a 30 días",ag["0-30"],agN["0-30"],OK],["30 a 60 días",ag["30-60"],agN["30-60"],WARN],["60 a 90 días",ag["60-90"],agN["60-90"],"#F97316"],["Más de 90 días",ag["90+"],agN["90+"],DANGER]].map(([l,v,n,c],i)=>(
              <div key={i} style={{flex:1,background:"#0F172A",borderRadius:6,padding:7,borderTop:`3px solid ${c}`}}>
                <div style={{fontSize:7,color:"#64748B"}}>{l}</div>
                <div style={{fontSize:14,fontWeight:800,color:c}}>{F(v)}</div>
                <div style={{fontSize:7,color:"#475569"}}>{n} clientes</div>
                <div style={{marginTop:3}}><Bar v={v} mx={dynTcxc||1} co={c}/></div>
              </div>
            ))}
          </div>
          <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden"}}>
            <div style={{padding:"5px 8px",background:NAVY,fontSize:8,fontWeight:700,color:DANGER,display:"flex",justifyContent:"space-between"}}>
              <span>Cuentas por cobrar — ordenadas por monto</span>
              <span style={{color:"#64748B",fontSize:7}}>Editar pagado para registrar abono</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>#</th><th style={th}>Cliente</th><th style={thr}>Adeudado</th><th style={thr}>Pagado</th><th style={thr}>Total venta</th><th style={thr}>Días</th><th style={th}>Aging</th><th style={th}>Medio pago</th><th style={{...th,width:50}}>Acción</th></tr></thead>
              <tbody>{[...dynCxc].sort((a,b)=>b.a-a.a).map((c,i)=>{
                const ac=c.days>90?DANGER:c.days>60?"#F97316":c.days>30?WARN:OK;
                const orig=clientsRetro.find(x=>x.n===c.n&&(x.vta-x.pag)>0);
                return(<tr key={i} style={{borderBottom:"1px solid #334155",background:i<3?"#1a1520":undefined}}>
                  <td style={tdc}><span style={{color:i<3?DANGER:GOLD,fontWeight:700}}>{i+1}</span></td>
                  <td style={td}>{c.n} <span style={{fontSize:7,color:"#475569"}}>20{c.y}</span></td>
                  <td style={{...tdr,fontWeight:700,color:c.a>5000?DANGER:c.a>2000?WARN:"#E2E8F0"}}>{F(c.a)}</td>
                  <td style={tdr}>{orig&&editId===orig.id?(<input type="number" value={orig.pag} onChange={e=>setClients(prev=>prev.map(x=>x.id===orig.id?{...x,pag:Number(e.target.value)}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:GOLD,fontSize:8,padding:"2px 3px",width:60,textAlign:"right"}}/>):<span style={{color:GOLD}}>{orig?F(orig.pag):"—"}</span>}</td>
                  <td style={{...tdr,color:"#94A3B8"}}>{orig?F(orig.vta):"—"}</td>
                  <td style={{...tdr,color:ac,fontWeight:700}}>{c.days}d</td>
                  <td style={td}><span style={{fontSize:7,padding:"1px 3px",borderRadius:2,background:`${ac}22`,color:ac,fontWeight:700}}>{c.aging}</span></td>
                  <td style={{...td,fontSize:7}}>{orig?orig.mp:"—"}</td>
                  <td style={tdc}>{orig?(editId===orig.id?(<button onClick={()=>setEditId(null)} style={{background:OK,color:"#fff",border:"none",borderRadius:2,fontSize:7,padding:"2px 4px",cursor:"pointer"}}>OK</button>):(<button onClick={()=>setEditId(orig.id)} style={{background:"transparent",color:"#64748B",border:"1px solid #334155",borderRadius:2,fontSize:7,padding:"1px 4px",cursor:"pointer"}}>Abonar</button>)):"—"}</td>
                </tr>);})}</tbody>
            </table>
          </div>
        </>}

        {/* VALOR DEL CLIENTE (LTV) */}
        {tab==="LTV"&&<>
          <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
            <K l="Valor promedio recurrente" v={F(dynAvgLTV)} co={OK} s={`vs ${F(dynOneTimeLTV)} cliente nuevo`}/>
            <K l="Ratio de valor" v={`${dynLtvRatio.toFixed(1)}x`} co={dynLtvRatio>=3?OK:WARN} s={dynLtvRatio>=3?"Excelente":"Saludable"}/>
            <K l="Tasa de recompra" v={`${dynReRate.toFixed(0)}%`} co={dynReRate>=15?OK:WARN} s={`${dynRecurrents.length} de ${dynTotalClients} clientes`}/>
            <K l="Revenue de recurrentes" v={F(dynTotalRecRev)} co={GOLD} s={`${(clients.reduce((a,c)=>a+c.vta,0)>0?(dynTotalRecRev/clients.reduce((a,c)=>a+c.vta,0)*100).toFixed(0):0)}% del total`}/>
          </div>
          <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${OK}44`,padding:10,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:9,fontWeight:700,color:GOLD}}>Salud del valor del cliente comparado con la industria</span>
              <span style={{fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:3,background:`${OK}22`,color:OK}}>{dynLtvRatio>=3?"Excelente":"Saludable"}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
              {[["Ratio de valor",`${dynLtvRatio.toFixed(1)}x`,"Mayor a 2x es saludable, mayor a 3x es excelente",dynLtvRatio>=3?OK:dynLtvRatio>=2?WARN:DANGER],
                ["Tasa de recompra",`${dynReRate.toFixed(0)}%`,"Mayor a 15% es saludable, mayor a 25% es excelente",dynReRate>=25?OK:dynReRate>=15?WARN:DANGER],
                ["Frecuencia de recompra","Cada ~3 meses","Menos de 6 meses es excelente",OK]
              ].map(([l,v,b,c],i)=>(
                <div key={i} style={{background:"#0F172A",borderRadius:5,padding:8,borderLeft:`3px solid ${c}`}}>
                  <div style={{fontSize:8,color:"#64748B"}}>{l}</div>
                  <div style={{fontSize:14,fontWeight:800,color:c,marginTop:2}}>{v}</div>
                  <div style={{fontSize:8,color:"#475569",marginTop:2}}>{b}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8,padding:8,background:"#0F172A",borderRadius:4}}>
              <div style={{fontSize:9,fontWeight:700,color:GOLD,marginBottom:4}}>Cómo se calcula el valor del cliente (LTV)</div>
              <div style={{fontSize:10,color:"#94A3B8",lineHeight:1.7}}>
                El valor de vida del cliente es la suma de todo el revenue que ha generado durante su relación con el negocio. Para un cliente que compra una sola vez: $6,200 por la máquina más el 58% de probabilidad de comprar asesoría ($2,000) = <strong style={{color:"#fff"}}>{F(dynOneTimeLTV)}</strong>. Para un cliente recurrente, se suman todas sus compras históricas, dando un promedio de <strong style={{color:OK}}>{F(dynAvgLTV)}</strong>.
                <br/><br/>
                Ajustado al margen bruto del 53%, cada recurrente genera {F(dynAvgLTV*0.53)} de ganancia bruta a lo largo de su vida, mientras que un cliente nuevo genera {F(dynOneTimeLTV*0.53)}. <strong style={{color:GOLD}}>Un cliente recurrente vale {dynLtvRatio.toFixed(1)} veces más que uno nuevo.</strong>
              </div>
            </div>
          </div>
          <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden"}}>
            <div style={{padding:"5px 8px",background:NAVY,fontSize:8,fontWeight:700,color:GOLD}}>Clientes con mayor LTV (valor de vida del cliente)</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>#</th><th style={th}>Cliente</th><th style={thr}>Compras</th><th style={thr}>Máquinas</th><th style={thr}>Revenue total</th><th style={th}>Período</th><th style={{...thr,width:60}}></th></tr></thead>
              <tbody>{dynRecurrents.map((c,i)=>(<tr key={i} style={{borderBottom:"1px solid #334155"}}>
                <td style={tdc}><span style={{color:i<3?GOLD:"#64748B",fontWeight:700}}>{i+1}</span></td>
                <td style={td}>{c.n}</td><td style={tdc}>{c.purchases}</td><td style={tdc}>{c.mq}</td>
                <td style={{...tdr,fontWeight:700,color:OK}}>{F(c.total)}</td>
                <td style={{...td,fontSize:7,color:"#64748B"}}>{c.first.slice(0,7)} → {c.last.slice(0,7)}</td>
                <td style={tdr}><Bar v={c.total} mx={dynRecurrents.length>0?dynRecurrents[0].total:1} co={i<3?GOLD:BLUE}/></td>
              </tr>))}</tbody>
            </table>
          </div>
        </>}

        
        {/* REFERIDOS */}
        {tab==="Referidos"&&<>
          <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
            <K l="Referidos (histórico)" v={totalRefs} co={GOLD} s="datos importados del sheet"/>
            <K l="Cerrados (histórico)" v={refsCerrados} co={OK} s={`${totalRefs>0?(refsCerrados/totalRefs*100).toFixed(0):0}% tasa de cierre`}/>
            <K l="Referidos nuevos (dinámico)" v={dynRefTotal} co={BLUE} s={`${dynRefCerrados} cerrados desde registro`}/>
            <K l="Revenue por referidos" v={F(dynRefList.reduce((a,r)=>a+r.rev,0))} co={OK} s={`${dynRefList.reduce((a,r)=>a+r.mq,0)} máquinas`}/>
          </div>
          {dynRefList.length>0&&<div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${BLUE}44`,padding:10,marginBottom:8}}>
            <div style={{fontSize:9,fontWeight:700,color:BLUE,marginBottom:6}}>Referidos dinámicos (desde Registro de Ventas)</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>Referidor</th><th style={thr}>Referidos</th><th style={thr}>Máquinas</th><th style={thr}>Revenue</th></tr></thead>
              <tbody>{dynRefList.map((r,i)=>(<tr key={i} style={{borderBottom:"1px solid #334155"}}><td style={td}>{r.n}</td><td style={tdr}>{r.t}</td><td style={tdr}>{r.mq}</td><td style={{...tdr,color:OK,fontWeight:700}}>{F(r.rev)}</td></tr>))}</tbody>
            </table>
          </div>}

          {/* VALOR ECONÓMICO */}
          <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${OK}44`,padding:12,marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:OK,marginBottom:8}}>Valor económico generado por el programa de referidos</div>
            <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
              <K l="Revenue generado" v="$51,400" co={OK} s="7 máquinas + 4 asesorías"/>
              <K l="Ganancia bruta" v="$31,030" co={OK} s="Margen 60.4%"/>
              <K l="Comisiones pagadas" v="$750" co={WARN} s="3 de 6 cierres con comisión"/>
              <K l="Ganancia neta post-comisiones" v="$30,280" co={OK} s="Margen 58.9%"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
              <div style={{background:"#0F172A",borderRadius:5,padding:8,borderLeft:`3px solid ${OK}`}}>
                <div style={{fontSize:8,color:"#64748B"}}>Retorno sobre inversión</div>
                <div style={{fontSize:18,fontWeight:800,color:OK,marginTop:2}}>4,137%</div>
                <div style={{fontSize:8,color:"#475569",marginTop:2}}>Cada $1 en comisiones generó $41 en ganancia bruta</div>
              </div>
              <div style={{background:"#0F172A",borderRadius:5,padding:8,borderLeft:`3px solid ${GOLD}`}}>
                <div style={{fontSize:8,color:"#64748B"}}>Costo de adquisición por cliente</div>
                <div style={{fontSize:18,fontWeight:800,color:GOLD,marginTop:2}}>$125</div>
                <div style={{fontSize:8,color:"#475569",marginTop:2}}>Promedio sobre 6 cierres ($250 solo los 3 con comisión)</div>
              </div>
              <div style={{background:"#0F172A",borderRadius:5,padding:8,borderLeft:`3px solid ${STEEL}`}}>
                <div style={{fontSize:8,color:"#64748B"}}>Ahorro vs anuncios pagados</div>
                <div style={{fontSize:18,fontWeight:800,color:STEEL,marginTop:2}}>$1,050</div>
                <div style={{fontSize:8,color:"#475569",marginTop:2}}>Si estos 6 clientes vinieran por ads a $300 cada uno = $1,800</div>
              </div>
            </div>

            {/* DETALLE POR CIERRE */}
            <div style={{fontSize:9,fontWeight:700,color:"#94A3B8",marginBottom:4}}>Detalle de los 6 cierres por referido</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9,marginBottom:8}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>Referidor</th><th style={th}>Cliente cerrado</th><th style={thr}>Venta</th><th style={thr}>Ganancia</th><th style={thr}>Comisión</th><th style={th}>Estado comisión</th></tr></thead>
              <tbody>
                {[
                  ["Yamel Mata","Ironelly Núñez",8200,5290,0,"No aplica (cerrado antes)"],
                  ["Juan Miguel Sosa","Saulina Sánchez",8200,5040,250,"Pagar comisión"],
                  ["Julio Alexander","Carolina Mejía",8200,5290,0,"No aplica (contactada antes)"],
                  ["Ignacio Dehenen","Perla Pichardo",8200,5290,0,"No lleva comisión"],
                  ["Vinicio Dominguez","Rodrigo Díaz",12400,6330,250,"Pagar comisión"],
                  ["Dalvin Toledo","Emil Henríquez",6200,3040,250,"Pagar comisión"],
                ].map(([ref,cli,vta,gan,com,est],i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #334155"}}>
                    <td style={td}>{ref}</td>
                    <td style={td}>{cli}</td>
                    <td style={{...tdr,fontWeight:700}}>{F(vta)}</td>
                    <td style={{...tdr,color:OK}}>{F(gan)}</td>
                    <td style={{...tdr,color:com>0?WARN:"#64748B"}}>{com>0?F(com):"$0"}</td>
                    <td style={{...td,fontSize:8,color:com>0?WARN:"#64748B"}}>{est}</td>
                  </tr>
                ))}
                <tr style={{background:"#0F172A",fontWeight:700}}>
                  <td style={td} colSpan={2}>Total</td>
                  <td style={tdr}>$51,400</td>
                  <td style={{...tdr,color:OK}}>$30,280</td>
                  <td style={{...tdr,color:WARN}}>$750</td>
                  <td style={td}></td>
                </tr>
              </tbody>
            </table>

            {/* PIPELINE */}
            <div style={{background:"#0F172A",borderRadius:5,padding:8,border:"1px solid #334155"}}>
              <div style={{fontSize:9,fontWeight:700,color:WARN,marginBottom:4}}>Pipeline: valor potencial de los 29 referidos en seguimiento</div>
              <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.7}}>
                Si se mantiene la tasa de cierre del 11%, los 29 referidos en seguimiento pueden generar aproximadamente 3 cierres adicionales. Eso representa ~$24,600 en revenue y ~$15,870 en ganancia bruta. Para maximizar la conversión, se recomienda una secuencia de reactivación por WhatsApp con oferta exclusiva para referidos.
              </div>
            </div>
          </div>

          {/* EFECTIVIDAD POR REFERIDOR */}
          <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden",marginBottom:8}}>
            <div style={{padding:"5px 8px",background:NAVY,fontSize:8,fontWeight:700,color:GOLD}}>Efectividad por referidor (ordenado por total de referidos)</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>Referidor</th><th style={thr}>Total</th><th style={thr}>Cerrados</th><th style={thr}>Seguim.</th><th style={thr}>Perdidos</th><th style={thr}>Tasa cierre</th><th style={{...thr,width:70}}>Efectividad</th></tr></thead>
              <tbody>{refsState.map((r,i)=>{const rate=r.t>0?(r.c/r.t*100):0;const rc=rate>=30?OK:rate>=10?WARN:r.c>0?STEEL:DANGER;return(
                <tr key={i} style={{borderBottom:"1px solid #334155"}}>
                  <td style={td}>{r.n}</td>
                  <td style={tdr}>{r.t}</td>
                  <td style={{...tdr,color:r.c>0?OK:"#64748B",fontWeight:r.c>0?700:400}}>{r.c}</td>
                  <td style={{...tdr,color:r.s>0?WARN:"#64748B"}}>{r.s}</td>
                  <td style={{...tdr,color:r.p>0?DANGER:"#64748B"}}>{r.p}</td>
                  <td style={{...tdr,color:rc,fontWeight:700}}>{rate.toFixed(0)}%</td>
                  <td style={tdr}><Bar v={rate} mx={100} co={rc}/></td>
                </tr>)})}</tbody>
            </table>
          </div>

          {/* ANÁLISIS */}
          <div style={{background:"#0F172A",borderRadius:6,padding:10,border:`1px solid ${GOLD}33`}}>
            <div style={{fontSize:10,fontWeight:700,color:GOLD,marginBottom:6}}>Análisis del programa de referidos</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.7}}>
              El programa ha generado <strong style={{color:"#fff"}}>$51,400 en revenue</strong> y <strong style={{color:OK}}>$30,280 en ganancia neta</strong> con una inversión de solo $750 en comisiones, lo que equivale a un retorno del 4,137%. El costo de adquisición por cliente vía referidos es de $125 en promedio, menos de la mitad del costo proyectado por anuncios pagados ($300 por cliente).
              <br/><br/>
              Ignacio Dehenen lidera en volumen con 20 referidos, pero su tasa de conversión es baja (5%). Esto sugiere que envía contactos poco calificados. Los referidores más efectivos son <strong style={{color:OK}}>Vinicio Dominguez (50%)</strong>, <strong style={{color:OK}}>Juan Miguel Sosa (33%)</strong> y <strong style={{color:OK}}>Yamel Mata (20%)</strong>. Considerar un programa de incentivos escalonados que premie la calidad sobre la cantidad: por ejemplo, comisión base de $200 por cierre y un bono de $100 adicional si el referido paga el 100% al momento del cierre.
            </div>
          </div>
        </>}


        {/* GARANTÍAS Y ASESORÍAS */}
                {tab==="Garantías"&&<>
          <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
            <K l="Garantías activas" v={dynWd.filter(w=>w.dl>=0).length} co={OK} s={`${dynWExp} vencidas`}/>
            <K l="Vencen en 90 días" v={dynWd.filter(w=>w.dl>=0&&w.dl<=90).length} co={WARN} s="requieren atención"/>
            <K l="Asesorías activas" v={dynAAct} co={STEEL} s={`de ${Object.keys(firstAses).length} con asesoría`}/>
          </div>
          <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",padding:12,marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:GOLD,marginBottom:8}}>Garantía de máquinas (1 año desde fecha de compra)</div>
            <div style={{display:"flex",gap:3,marginBottom:6}}>
              {[["Vencida",dynWExp,DANGER],["0-30d",dynWd.filter(w=>w.dl>=0&&w.dl<=30).length,DANGER],["31-90d",dynWd.filter(w=>w.dl>30&&w.dl<=90).length,WARN],["91-180d",dynWd.filter(w=>w.dl>90&&w.dl<=180).length,"#F97316"],["181-270d",dynWd.filter(w=>w.dl>180&&w.dl<=270).length,STEEL],["271-365d",dynWd.filter(w=>w.dl>270).length,OK]].map(([label,count,color],i)=>(
                <div key={i} style={{flex:1,background:"#0F172A",borderRadius:5,padding:6,borderTop:`3px solid ${color}`}}>
                  <div style={{fontSize:7,color:"#64748B"}}>{label}</div>
                  <div style={{fontSize:16,fontWeight:800,color}}>{count}</div>
                </div>
              ))}
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>Cliente</th><th style={thr}>F. compra</th><th style={thr}>Días rest.</th><th style={thr}>Estado</th></tr></thead>
              <tbody>{dynWd.filter(w=>w.dl>=0&&w.dl<=90).sort((a,b)=>a.dl-b.dl).map((w,i)=>{const co=w.dl<=30?DANGER:w.dl<=60?WARN:"#F97316";return(
                <tr key={i} style={{borderBottom:"1px solid #334155"}}>
                  <td style={td}>{w.n}</td><td style={{...tdr,fontSize:8,color:"#94A3B8"}}>{w.d}</td>
                  <td style={{...tdr,fontWeight:700,color:co}}>{w.dl}d</td>
                  <td style={tdr}><span style={{fontSize:8,padding:"2px 5px",borderRadius:3,background:`${co}22`,color:co,fontWeight:700}}>{w.dl<=30?"Urgente":w.dl<=60?"Próxima":"En curso"}</span></td>
                </tr>);})}</tbody>
            </table>
          </div>
          <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${STEEL}44`,padding:12}}>
            <div style={{fontSize:10,fontWeight:700,color:STEEL,marginBottom:8}}>Asesorías activas — 4 meses desde inicio · clic en umbral para ver clientes</div>
            <div style={{display:"flex",gap:3,marginBottom:8}}>
              {[["Vence hoy/mañana",dynAd.filter(a=>a.dl>=0&&a.dl<=1),DANGER,"vence"],["1-30 días",dynAd.filter(a=>a.dl>1&&a.dl<=30),WARN,"30"],["31-60 días",dynAd.filter(a=>a.dl>30&&a.dl<=60),"#F97316","60"],["61-90 días",dynAd.filter(a=>a.dl>60&&a.dl<=90),STEEL,"90"],["Más de 90 días",dynAd.filter(a=>a.dl>90),OK,"90+"]].map(([label,list,color,key],i)=>(
                <div key={i} onClick={()=>setGarantiaUmbral(garantiaUmbral===key?null:key)} style={{flex:1,background:garantiaUmbral===key?`${color}22`:"#0F172A",borderRadius:5,padding:6,borderTop:`3px solid ${color}`,cursor:"pointer"}}>
                  <div style={{fontSize:7,color:"#64748B"}}>{label}</div>
                  <div style={{fontSize:16,fontWeight:800,color}}>{list.length}</div>
                  <div style={{fontSize:7,color:garantiaUmbral===key?color:"#475569"}}>{garantiaUmbral===key?"▲ ocultar":"▼ ver"}</div>
                </div>
              ))}
            </div>
            {garantiaUmbral&&<UmbralPanel dynAd={dynAd} umbral={garantiaUmbral} overrides={asesoriaOverrides} setOverrides={setAsesoriaOverrides} editId={editId} setEditId={setEditId}/>}
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
              <thead><tr style={{background:"#0F172A"}}><th style={th}>Cliente</th><th style={th}>F. inicio</th><th style={thr}>Días rest.</th><th style={thr}>Estado</th><th style={{...thr,width:60}}></th></tr></thead>
              <tbody>{dynAd.filter(a=>a.dl>=0).sort((a,b)=>a.dl-b.dl).map((a,i)=>{
                const co=a.dl<=1?DANGER:a.dl<=30?WARN:a.dl<=60?"#F97316":a.dl<=90?STEEL:OK;
                return(<tr key={i} style={{borderBottom:"1px solid #334155"}}>
                  <td style={{...td,fontWeight:600}}>{a.n}</td>
                  <td style={{...td,fontSize:8,color:asesoriaOverrides[a.k]?GOLD:"#94A3B8"}}>{a.fechaInicio}{asesoriaOverrides[a.k]&&<span style={{fontSize:6,marginLeft:3,color:GOLD}}>✎</span>}</td>
                  <td style={{...tdr,fontWeight:700,color:co}}>{a.dl===0?"Hoy":a.dl===1?"Mañana":`${a.dl}d`}</td>
                  <td style={tdr}><span style={{fontSize:8,padding:"2px 5px",borderRadius:3,background:`${co}22`,color:co,fontWeight:700}}>{a.dl<=1?"Vence hoy":a.dl<=30?"Urgente":a.dl<=60?"Próxima":a.dl<=90?"En curso":"Holgada"}</span></td>
                  <td style={tdr}><Bar v={Math.max(0,120-a.dl)} mx={120} co={co}/></td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </>}

{tab==="Money Tracker"&&(
            <>
              <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
                <K l="Total consolidado" v={posFD(posTotalDOP)} co={GOLD} s={`~${posFU(posTotalUSD)} USD`}/>
                <K l="Cash limpio" v={posFD(posCleanCash)} co={OK} s={`~${posFU(posCleanUSD)} USD (sin CxC)`}/>
                <K l="CxC dinámica" v={posFD(posCxcDOP)} co={WARN} s={`${clientsRetro.filter(c=>c.vta-c.pag>0).length} clientes`}/>
                <K l="Meta 2026" v="RD$61.5M" co={GOLD} s={`${posProjPct.toFixed(1)}% alcanzado`}/>
              </div>
              <div style={{background:"#1E293B",borderRadius:8,padding:"8px 12px",marginBottom:8,border:"1px solid #334155"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#94A3B8",marginBottom:3}}>
                  <span>Posición neta proyectada: {posFD(posPosNeta)} (~{posFU(Math.round(posPosNeta/posTc2))} USD)</span>
                  <span>{posProjPct.toFixed(1)}% de RD$61.5M</span>
                </div>
                <div style={{background:"#0F172A",borderRadius:4,height:10,overflow:"hidden"}}>
                  <div style={{width:`${Math.min(posProjPct,100)}%`,height:"100%",background:`linear-gradient(90deg,${STEEL},${OK})`,borderRadius:4}}/>
                </div>
              </div>
              <div style={{background:"#1E293B",borderRadius:8,border:"1px solid #334155",overflow:"hidden",marginBottom:8}}>
                <div style={{padding:"5px 8px",background:NAVY,fontSize:8,fontWeight:700,color:GOLD}}>Desglose de cuentas — Money Tracker</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                  <thead><tr style={{background:"#0F172A"}}><th style={th}>Cuenta</th><th style={th}>Categoría</th><th style={thr}>Monto DOP</th><th style={thr}>~USD</th><th style={thr}>%</th><th style={{...thr,width:60}}></th><th style={{...th,width:45}}>Acción</th></tr></thead>
                  <tbody>{posCuentas.map((c,i)=>{const pct=posTotalDOP>0?(c.v/posTotalDOP*100):0;const usd=c.mon==="USD"?c.usdReal||Math.round(c.v/posTc2):Math.round(c.v/posTc2);return(
                    <tr key={i} style={{borderBottom:"1px solid #334155"}}>
                      <td style={{...td,fontWeight:c.v>1000000?600:400}}>{c.n}{c.dynamic?<span style={{fontSize:7,color:WARN,marginLeft:3}}>AUTO</span>:""}</td>
                      <td style={{...td,fontSize:7}}><span style={{padding:"1px 3px",borderRadius:2,background:c.cat==="Empresarial"?`${BLUE}22`:c.cat==="Inversión"?`${GOLD}22`:c.cat==="Personal"?`${STEEL}22`:"#33415522",color:c.cat==="Empresarial"?BLUE:c.cat==="Inversión"?GOLD:c.cat==="Personal"?STEEL:"#64748B"}}>{c.cat}</span></td>
                      <td style={tdr}>{editCuentaId===c.id&&!c.dynamic?(<input type="number" value={Math.round(c.v)} onChange={e=>setCuentasState(prev=>prev.map(x=>x.id===c.id?{...x,v:Number(e.target.value)}:x))} style={{background:"#0F172A",border:"1px solid #334155",borderRadius:2,color:"#E2E8F0",fontSize:8,padding:"2px 3px",width:100,textAlign:"right"}}/>):<span style={{fontWeight:c.v>1000000?700:400}}>{posFD(c.v)}</span>}</td>
                      <td style={{...tdr,color:"#94A3B8"}}>{posFU(usd)}</td>
                      <td style={{...tdr,fontSize:8,color:"#64748B"}}>{pct.toFixed(1)}%</td>
                      <td style={tdr}><Bar v={c.v} mx={posTotalDOP*0.35} co={c.cat==="Empresarial"?BLUE:c.cat==="Inversión"?GOLD:STEEL}/></td>
                      <td style={tdc}>{c.dynamic?"—":(editCuentaId===c.id?(<button onClick={()=>setEditCuentaId(null)} style={{background:OK,color:"#fff",border:"none",borderRadius:2,fontSize:7,padding:"2px 4px",cursor:"pointer"}}>OK</button>):(<button onClick={()=>setEditCuentaId(c.id)} style={{background:"transparent",color:"#64748B",border:"1px solid #334155",borderRadius:2,fontSize:7,padding:"1px 4px",cursor:"pointer"}}>Editar</button>))}</td>
                    </tr>)})}</tbody>
                </table>
              </div>
              <div style={{display:"flex",gap:3,marginBottom:8}}>
                {posCatTotals.map((ct,i)=>{const co=[BLUE,GOLD,STEEL,"#64748B"][i];return(
                  <div key={i} style={{flex:1,background:"#0F172A",borderRadius:5,padding:6,borderTop:`3px solid ${co}`}}>
                    <div style={{fontSize:7,color:"#64748B"}}>{ct.cat}</div>
                    <div style={{fontSize:14,fontWeight:800,color:co}}>{(ct.total/posTotalDOP*100).toFixed(0)}%</div>
                    <div style={{fontSize:7,color:"#475569"}}>{posFD(ct.total)}</div>
                  </div>
                );})}
              </div>
              <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${OK}33`,padding:12,marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:OK,marginBottom:8}}>Proyección al vender inventario pendiente</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                  {[["Máquinas disponibles",posInvMaq,"#fff",""],["Revenue bruto",`+${posFD(posRevInv)}`,OK,`${posInvMaq} máq + ${posInvAses} ases`],["− CxP + OPEX",`−${posFD(posCxpContainer+posOpex3m)}`,DANGER,""],["= Posición neta",posFD(posPosNeta),GOLD,`~${posFU(Math.round(posPosNeta/posTc2))} USD`]].map(([l,v,co,s],i)=>(
                    <div key={i} style={{background:"#0F172A",borderRadius:5,padding:8}}>
                      <div style={{fontSize:8,color:"#64748B"}}>{l}</div>
                      <div style={{fontSize:14,fontWeight:800,color:co}}>{v}</div>
                      {s&&<div style={{fontSize:7,color:"#475569"}}>{s}</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"#1E293B",borderRadius:8,border:`1px solid ${GOLD}44`,padding:12,marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:GOLD,marginBottom:8}}>Ruta al millón USD</div>
                <div style={{display:"flex",gap:4,alignItems:"flex-end",height:120,marginBottom:8}}>
                  {posMonths.map((m,i)=>{const h=m.bal/posMaxBal*100;const isMil=m.bal>=1000000;return(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{fontSize:7,color:isMil?GOLD:"#94A3B8",fontWeight:isMil?800:400}}>{F(m.bal)}</div>
                      <div style={{width:"100%",background:isMil?GOLD:m.bal>=414055?BLUE:"#334155",borderRadius:"3px 3px 0 0",height:`${h}%`,minHeight:4}}/>
                      <div style={{fontSize:7,color:isMil?GOLD:"#64748B",fontWeight:700}}>{m.m}</div>
                    </div>
                  );})}
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
                  <thead><tr style={{background:"#0F172A"}}><th style={th}>Mes</th><th style={thr}>Net profit</th><th style={thr}>Balance</th><th style={thr}>Máq</th><th style={th}>Nota</th></tr></thead>
                  <tbody>{posMonths.map((m,i)=>(<tr key={i} style={{borderBottom:"1px solid #334155",background:m.bal>=1000000?"#1a2520":undefined}}>
                    <td style={{...td,fontWeight:700,color:m.bal>=1000000?GOLD:"#E2E8F0"}}>{m.m}</td>
                    <td style={{...tdr,color:m.net>0?OK:"#64748B"}}>{m.net>0?`+${F(m.net)}`:"—"}</td>
                    <td style={{...tdr,fontWeight:700,color:m.bal>=1000000?GOLD:m.bal>=500000?OK:"#E2E8F0"}}>{F(m.bal)}</td>
                    <td style={tdr}>{m.maq>0?m.maq:"—"}</td>
                    <td style={{...td,fontSize:8,color:"#64748B"}}>{m.note}</td>
                  </tr>))}</tbody>
                </table>
              </div>
              <div style={{background:"#0F172A",borderRadius:6,padding:"8px 12px",border:"1px solid #334155"}}>
                <div style={{fontSize:9,color:"#94A3B8",lineHeight:1.6}}>
                  <span style={{color:WARN,fontWeight:700}}>Nota:</span> Los montos en USD de Popular BIZ y Santa Cruz BIZ reflejan dólares reales en banco (~USD$126,600). CxC se calcula desde el Registro de Ventas. OPEX se calcula desde el tab de Gastos. Fuente: Money Tracker marzo 2026.
                </div>
              </div>
            </>
        )}

        {/* SUGERENCIAS */}
                {/* GUÍA */}
        {tab==="Guía"&&<>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:GOLD,marginBottom:10}}>Manual operativo del dashboard</div>
          <Inf color={OK}>
            <div style={{fontSize:11,fontWeight:700,color:OK,marginBottom:6}}>REGISTRAR UNA VENTA NUEVA</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              1. Ir al tab <strong style={{color:"#fff"}}>Registro de Ventas</strong><br/>
              2. Presionar <strong style={{color:OK}}>+ Nuevo Cliente</strong><br/>
              3. Llenar los campos obligatorios (marcados con *):<br/>
              &nbsp;&nbsp;• <strong style={{color:DANGER}}>Cédula/RNC</strong> — sin este campo NO se puede guardar<br/>
              &nbsp;&nbsp;• <strong>Nombre completo</strong> del cliente<br/>
              &nbsp;&nbsp;• <strong>Fecha de compra</strong> — usar la fecha real de cierre<br/>
              4. Llenar los campos de venta: máquinas, asesorías, monto, pagado<br/>
              5. Si el cliente fue referido, escribir el nombre del referidor en <strong style={{color:BLUE}}>Referido por</strong><br/>
              6. Presionar <strong style={{color:OK}}>Guardar registro</strong><br/><br/>
              <strong style={{color:WARN}}>Al guardar se actualiza automáticamente:</strong> Cobros pendientes (si hay saldo), Garantías, Valor del cliente (si es recurrente), Posición actual, tab 2026, inventario disponible, y referidos.
            </div>
          </Inf>
          <Inf color={BLUE}>
            <div style={{fontSize:11,fontWeight:700,color:BLUE,marginBottom:6}}>REGISTRAR UN COBRO / ABONO</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              1. Ir al tab <strong style={{color:"#fff"}}>Registro de Ventas</strong><br/>
              2. Buscar al cliente con los filtros o haciendo scroll<br/>
              3. Presionar <strong>Editar</strong> en la fila del cliente<br/>
              4. Modificar el campo <strong style={{color:GOLD}}>Pagado</strong> sumando el abono nuevo al monto anterior<br/>
              5. Presionar <strong style={{color:OK}}>OK</strong><br/><br/>
              <strong style={{color:DANGER}}>NO crear un registro nuevo para un abono.</strong> El abono se registra editando el campo Pagado del registro existente. Crear un registro nuevo duplica la venta.
            </div>
          </Inf>
          <Inf color={WARN}>
            <div style={{fontSize:11,fontWeight:700,color:WARN,marginBottom:6}}>ERRORES COMUNES A EVITAR</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              <strong style={{color:DANGER}}>1. Registrar un abono como venta nueva</strong> — infla el revenue y crea un cliente fantasma. Los abonos se registran editando el campo Pagado.<br/><br/>
              <strong style={{color:DANGER}}>2. Dejar la cédula vacía</strong> — sin cédula el sistema no detecta clientes recurrentes. Aparece "REQUERIDO" en rojo como alerta.<br/><br/>
              <strong style={{color:DANGER}}>3. Poner el monto en pesos en el campo de USD</strong> — los campos de Venta y Pagado son en USD. Si el cliente pagó en pesos, convertir a USD antes de registrar.<br/><br/>
              <strong style={{color:DANGER}}>4. No registrar fecha de entrega</strong> — editar el registro cuando se entregue la máquina para llenar la fecha de entrega. Esto alimenta el cálculo de días hábiles.<br/><br/>
              <strong style={{color:WARN}}>5. Confundir tipo de compra</strong> — si el cliente compró máquina + asesoría, poner asesorías = 1 (o más). El tipo de compra se calcula automáticamente.
            </div>
          </Inf>
          <Inf color={STEEL}>
            <div style={{fontSize:11,fontWeight:700,color:STEEL,marginBottom:6}}>REGISTRAR UN GASTO</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              1. Ir al tab <strong style={{color:"#fff"}}>Gastos</strong> (solo visible para Admin)<br/>
              2. Presionar <strong style={{color:OK}}>+ Nuevo gasto</strong><br/>
              3. Seleccionar categoría, escribir concepto, monto en RD$, y mes<br/>
              4. Guardar — se refleja automáticamente en el OPEX del tab 2026
            </div>
          </Inf>
          <Inf color={GOLD}>
            <div style={{fontSize:11,fontWeight:700,color:GOLD,marginBottom:6}}>REFERIDOS</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              Al registrar un cliente nuevo, si fue referido por alguien, escribir el nombre del referidor en el campo <strong style={{color:BLUE}}>Referido por</strong>. Esto actualiza automáticamente el tab de Referidos con el conteo y revenue generado por cada referidor.<br/><br/>
              <strong style={{color:WARN}}>Importante:</strong> Usar siempre el mismo nombre para el mismo referidor (ej: siempre "Vinicio Dominguez", no a veces "Vinicio" y a veces "Vinicio D."). La consistencia del nombre es lo que agrupa los referidos correctamente.
            </div>
          </Inf>
          <Inf color={DANGER}>
            <div style={{fontSize:11,fontWeight:700,color:DANGER,marginBottom:6}}>QUÉ NO TOCAR</div>
            <div style={{fontSize:10,color:"#CBD5E1",lineHeight:1.8}}>
              • <strong>No editar registros de 2025</strong> sin autorización — son datos históricos cerrados<br/>
              • <strong>No borrar registros</strong> — si hay un error, editarlo, no eliminarlo<br/>
              • <strong>No cambiar la tasa de cambio</strong> sin autorización — afecta todos los cálculos del dashboard<br/>
              • <strong>Los datos se guardan automáticamente</strong> — cualquier cambio persiste al recargar la página
            </div>
          </Inf>
        </>}
      </div>
    </div>
  );
}
