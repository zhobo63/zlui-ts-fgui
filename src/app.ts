import { ImGui, ImGui_Impl, ImGuiObject } from "@zhobo63/imgui-ts";
import { UIMgr, UIWin } from "@zhobo63/zlui-ts";
import { BackendImGui } from "@zhobo63/zlui-ts/src/BackendImGui";
import { FGUI, FGUIPackage } from "./zlUI/fgui/fgui";

export class App
{
    public constructor()
    {
    }

    async Initialize(canvas:HTMLCanvasElement) {

        let mgr=new UIMgr;
        this.ui=mgr;
        this.ui.backend=new BackendImGui(ImGui.GetBackgroundDrawList());

        let root:UIWin;
        let fgui=await FGUI.Load("BlueSkin.fui", "res/BlueSkin/").then(fgui=>{
            return fgui;
        });
        root=fgui.Create("Demo", mgr);
        if(root) {
            console.log("FGUI Demo",root);
            mgr.AddChild(root);            
        }

        // let fgui=await FGUI.Load("Lobby_mixgame.fui", "res/Lobby_mixgame/").then(fgui=>{
        //     return fgui;
        // });
        // root=fgui.Create("main_all", mgr);
        // if(root) {
        //     console.log("FGUI Lobby_mixgame",root);
        //     mgr.AddChild(root);            
        // }

        this.root=root;

        this.OnResize(canvas.scrollWidth, canvas.scrollHeight);
    }

    MainLoop(time:number, drawlist:ImGui.DrawList):void 
    {
        let io=ImGui.GetIO();
        let ui=this.ui;
        ui.any_pointer_down=(!ImGui.GetHoveredWindow())?ImGui_Impl.any_pointerdown():false;
        ui.mouse_pos.Set(io.MousePos.x, io.MousePos.y);
        ui.mouse_wheel=io.MouseWheel;
        ui.Refresh(io.DeltaTime);
        ui.Paint();

        ImGui.Begin("inspector");
        ImGuiObject(ui);        
        ImGui.End();
    }
    OnResize(width:number, height:number):void {
        this.width=width;
        this.height=height;

        if(this.root) {
            this.root.origin.Set(0,0);
            let scalew=width/this.root.w;
            let scaleh=height/this.root.h;
            let scale=Math.min(scalew, scaleh);
            this.root.scale=scale;
        }
        this.ui.OnResize(width, height);
        this.ui.Refresh(0);
    }    
    isPortrait():boolean {
        return this.height>this.width;
    }

    canvas:HTMLCanvasElement;
    isDirty:boolean=false;
    ui:UIMgr;    
    width:number;
    height:number;

    fgui:FGUIPackage;
    root:UIWin;
}

export const gApp=new App;