import { ImGui, ImGui_Impl, ImGuiObject } from "@zhobo63/imgui-ts";
import { UIMgr } from "@zhobo63/zlui-ts";
import { BackendImGui } from "@zhobo63/zlui-ts/src/BackendImGui";
import { FGUI, FGUIPackage } from "./zlUI/fgui/fgui";

export class App
{
    public constructor()
    {
    }

    async Initialize(canvas:HTMLCanvasElement) {
        let fgui=await FGUI.Load("BlueSkin.fui", "res/BlueSkin/").then(fgui=>{
            return fgui;
        });

        let mgr=new UIMgr;
        this.ui=mgr;
        this.ui.backend=new BackendImGui(ImGui.GetBackgroundDrawList());

        let root=fgui.Create("Demo", mgr);
        if(root) {
            console.log("FGUI Demo",root);
            mgr.AddChild(root);            
        }

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
}

export const gApp=new App;