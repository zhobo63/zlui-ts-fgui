import {ImGui, ImGui_Impl} from '@zhobo63/imgui-ts'
import { gApp } from './app';

let lock_time=0;
let lock_fps=1/30;
let prev_time:number=0;

let backgroundColor:ImGui.ImVec4;

// class APP extends App
// {
//     constructor() {
//         super();

//         let fui="BlueSkin.fui";
//         let path="res/BlueSkin/";
//         let root="Demo";
//         //let fui="lobby.fui";
//         //let path="res/lobby/";
//         //let root="Lobby";

//         FGUI.Load(fui,path).then(fgui=>{
//             this.fgui=fgui;
//             let mgr=new zlUIMgr;
//             mgr.Name="root";
//             mgr.default_w=1920;
//             mgr.default_h=720;
//             mgr.x=0;
//             mgr.x=0;
//             mgr.w=mgr.default_w;
//             mgr.h=mgr.default_h;

//             let ui=fgui.Create(root, mgr);
//             if(ui) {
//                 console.log(ui);
//                 mgr.AddChild(ui);
//             }
//             mgr.ScaleWH(this.width, this.height, ScaleMode.AspectRatio);
//             this.mgr=mgr;
//             console.log("load done!");
//         })
//     }



// }

function _loop(time:number):void {
    let ti=(time-prev_time)*0.001;
    prev_time=time;
    lock_time+=ti;
    if(lock_time<lock_fps && !gApp.isDirty)  {
        window.requestAnimationFrame(_loop);
        return;
    }
    gApp.isDirty=false;
    lock_time=0;

    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    gApp.MainLoop(time, ImGui.GetBackgroundDrawList());

    ImGui.EndFrame();
    ImGui.Render();

    ImGui_Impl.ClearBuffer(backgroundColor);
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    window.requestAnimationFrame(_loop);
}

function anyPointer(e:Event)
{
    gApp.isDirty=true;
}

window.addEventListener('DOMContentLoaded', async () =>{
    await ImGui.default();
    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    let io=ImGui.GetIO();
    let font=io.Fonts.AddFontDefault();
    font.FontName="arial"
    font.FontStyle="bold";
    font.FontSize=16;    
    if(ImGui.isMobile.any())    {
        font.FontSize=20;
    }

    const canvas:HTMLCanvasElement=document.getElementById('canvas') as HTMLCanvasElement;
    ImGui_Impl.Init(canvas);

    console.log("FontScale", ImGui_Impl.font_scale);
    console.log("CanvasScale", ImGui_Impl.canvas_scale);

    await gApp.Initialize(canvas);
    gApp.OnResize(canvas.scrollWidth, canvas.scrollHeight);

    window.addEventListener("pointerdown", anyPointer);
    window.addEventListener("pointerup", anyPointer);
    window.addEventListener("pointermove", anyPointer);
    window.addEventListener("keydown", anyPointer);
    window.addEventListener("keyup", anyPointer);
    window.addEventListener("keypress", anyPointer);

    window.onresize=()=>{
        gApp.OnResize(canvas.scrollWidth, canvas.scrollHeight);
    }
    let style=ImGui.GetStyle();
    style.WindowRounding=4;
    style.FrameRounding=4;
    style.FrameBorderSize=1;
    style.ChildRounding=4;
    style.PopupRounding=4
    style.WindowMinSize.Set(200,160);
    style.Colors[ImGui.ImGuiCol.PopupBg].Set(0.2,0.2,0.2,1);
    
    backgroundColor=new ImGui.ImVec4(23/255,26/255,29/255,0);

    console.log(style);

    window.requestAnimationFrame(_loop);
})
