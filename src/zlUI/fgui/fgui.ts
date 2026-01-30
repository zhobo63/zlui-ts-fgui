import { ImageFont, BoardType, TexturePack, UIImage, UIImageText, UIMgr, UIPanel, UIWin } from "@zhobo63/zlui-ts";
import * as ZLIB from "pako"
import * as XML from "fast-xml-parser"
import { ImGui_Impl } from "@zhobo63/imgui-ts";

export const Version:string="0.0.1";

export class FGUIButton extends UIWin
{
    constructor(own:UIMgr)
    {
        super(own);
    }

    _csid_fgui:string="FGUIButton";

    Refresh(ti: number, parent?: UIWin): boolean {
        if(this.isEnable) {
            if(this._owner.hover==this) {
                this.isDown=this._owner.any_pointer_down;
            }
            if(this.win_disable) this.win_disable.isVisible=false;
            if(this.win_hover) this.win_hover.isVisible=false;
            if(this.win_down) this.win_down.isVisible=false;
            if(this.win_hover && this._owner.hover==this && !this.isDown) {
                this.win_hover.isVisible=true;
            }else if(this.win_down && this.isDown) {
                this.win_down.isVisible=true;
            }
        }
        else {
            if(this.win_disable) this.win_disable.isVisible=true;
            if(this.win_hover) this.win_hover.isVisible=false;
            if(this.win_down) this.win_down.isVisible=false;
        }
        return super.Refresh(ti, parent);
    }

    CalRect(parent: UIWin): void {
        super.CalRect(parent);

        for(let ch of this.pChild) {
            ch.isCanNotify=false;
            if(ch.Name.startsWith("disable")) {
                this.win_disable=ch as UIWin;
            }
            else if(ch.Name.startsWith("hover")) {
                this.win_hover=ch as UIWin;
            }
            else if(ch.Name.startsWith("down")) {
                this.win_down=ch as UIWin;
            }
        }
    }

    win_disable:UIWin;
    win_hover:UIWin;
    win_down:UIWin;
}

export class FGUIImageText extends UIImageText
{
    constructor(own:UIMgr)
    {
        super(own);
        this.text="";
    }

    _csid_fgui:string="FGUImageText";

    CalRect(parent: UIWin): void {

        this.image_font=[];
        for(let ch of this.pChild) {
            if(ch._csid==UIImage.CSID) {
                ch.isCanNotify=false;
                let img=ch as UIImage; 0
                let imgfont:ImageFont={
                    width:ch.w,
                    height:ch.h,
                    offset_x:ch.x,
                    offset_y:ch.y,
                    texture:img.image,
                    uv1:img.image.uv1,
                    uv2:img.image.uv2,
                };
                this.image_font.push(imgfont);
            }                            
        }

        super.CalRect(parent);
    }
}

enum EUIType
{
    Win,
    Image,
    Panel,
    Edit,
    Button,
    Check,
    Slider,
    ImageText,
}

enum EResourceType {
    None,
    Image,
    SWF,	//not support
    MovieClip,
    Sound,
    Index,
    Font,
    Atlas,
    Misc,
    Component,
    Graph,
    Text,
    Group,
    Sprite,
    Controller,
    DisplayList,
    Loader,
    MAX,
};

enum EAttribType {
    None,
    Id,
    Name,
    Path,
    Size,
    Scale,
    Scale9Grid,
    GridTile,
    XY,
    Src,
    File,
    Blend,
    Exported,
    Pivot,
    Color,
    Visible,
    Alpha,
    Extention,
    Mode,
    Controller,
    Pages,
    Target,
    SidePair,
    Title,
    Checked,
    Icon,
    Align,
    vAlign,
    AutoSize,
    SingleLine,
    Value,
    MaxValue,
    Text,
    Font,
    FontSize,
    Bold,
    ShadowColor,
    ShadowOffset,
    Selected,
    Flip,
    MAX,
};

enum EScaleType {
    None,
    Grid9,
    Tile,
};

enum EAlignType {
    None,
    Top,
    Left,
    Right,
    Bottom,
    Client,
    Center,
    MAX,
};

enum EPageType {
    Up,
    Down,
    Over,
    SelectedOver,
    Disable,
    SelectedDisable,
    MAX,
};

enum EBlendMode {
    Normal,
    Add,
    Multiply,
    Screen,
    Overlay,
    Darken,
    Lighten,
    ColorDodge,
    ColorBurn,
    HardLight,
    SoftLight,
    Difference,
    Exclusion,
    Hue,
    Saturation,
    Color,
    Luminosity,
    NormalNPM,
    AddNPM,
    ScreenNPM,
    None,
    SrcIn,
    SrcOut,
    SrcAtop,
    DstIn,
    DstOut,
    DstAtop,
    Subtract,
    SrcOver,
    Erase,
    XOR,
    MAX,
};

interface OnLoadAble {
    onload: any;
    onerror:any;
}

function LoadImage<T extends OnLoadAble>(src:T):Promise<T>
{
    return new Promise((resolve, reject)=>{
        src.onload=()=>resolve(src);
        src.onerror=reject;
    });
}

function ScaleType(s:string):EScaleType
{
    if(!s)
        return EScaleType.None;
    switch(s) {
    case '9grid':
        return EScaleType.Grid9;
    case 'tile':
        return EScaleType.Tile;
    default:
        //console.log("TODO ScaleType", s);
        break;
    }
    return EScaleType.None;
}

function ParseVec2(s:string):Vec2
{
    let row=s.split(/,/);
    return {x:Number.parseInt(row[0]),y:Number.parseInt(row[1]) }
}
function ParseVec4(s:string):Vec4
{
    let row=s.split(/,/);
    return {
        x:Number.parseInt(row[0]),
        y:Number.parseInt(row[1]),
        z:Number.parseInt(row[2]),
        w:Number.parseInt(row[3]),
    }
}

interface Vec2
{
    x:number;
    y:number;
}

interface Vec4
{
    x:number;
    y:number;
    z:number;
    w:number;
}

function toTexturePack(sprite:Sprite):TexturePack
{
    return {
        x1:sprite.x,
        y1:sprite.y,
        x2:sprite.x+sprite.width,
        y2:sprite.y+sprite.height,
        texture:sprite.texture,    
    };
}

interface Sprite
{
    id:string;
    index:number;
    x:number;
    y:number;
    width:number;
    height:number;
    texture:any;
    type:EResourceType;

}

class FGUImage
{
    scale_type:EScaleType=EScaleType.None;
    id:string;

}

class ByteBuffer
{
    constructor(buffer:ArrayBuffer)
    {
        this.dv=new DataView(buffer);
    }
    getInt32():number
    {
        let n=this.dv.getInt32(this.offset);
        this.offset+=4;
        return n;
    }

    dv:DataView;
    offset:number=0;
}

function makeFourCC(cc:string):number
{
    let n1=cc.charCodeAt(0);
    let n2=cc.charCodeAt(1);
    let n3=cc.charCodeAt(2);
    let n4=cc.charCodeAt(3);
    return (n1<<24)|(n2<<16)|(n3<<8)|n4;
}

const header_fgui= makeFourCC("FGUI");

class FGUIFile
{
    constructor(name:string, source:string)
    {
        this.name=name;
        this.source=source;
    }
    name:string;
    source:any;
    data:any;
}

class FGUIXmlFile extends FGUIFile
{
    constructor(name:string, source:string)
    {
        super(name, source);
        const xml_parser=new XML.XMLParser({
                ignoreAttributes : false,
                attributeNamePrefix : "",
                allowBooleanAttributes: true,
                parseAttributeValue: true,
                parseTagValue: true,
            });
        this.data=xml_parser.parse(source);
    }

    name:string;
    source:string;
    data:any;
}

class FGUIXmlParser
{
    constructor(data:FGUIPackage)
    {
        this.package=data;
    }
    async Parse(data:string)
    {
        let i=0;
        let start=0;
        let file_name:string=null;
        let file_size:number=0;
        let files=this.package.files;
        
        while(i<data.length)    {
            if(data.charAt(i)=='|') {
                if(!file_name)  {
                    file_name=data.slice(start, i);
                    start=i+1;
                }else {
                    file_size=Number.parseInt(data.slice(start,i));
                    start=i+1;
                    let xml=new FGUIXmlFile(file_name, data.slice(start,start+file_size));
                    files[file_name]=xml;
                    start+=file_size;
                    i=start;
                    file_name=null;
                    file_size=0;
                }
            }
            i++;
        }
        await this.ParseResource();
        this.ParseSprite();

    }

    async CreateAtlas(atlas :any, name:string)
    {
        atlas.type=EResourceType.Atlas;
        atlas.texture=new ImGui_Impl.Texture;
        let image=new Image;
        let loadprocess=LoadImage(image).then(r=>{
            atlas.texture.Update(image);
            console.log("load image "+ atlas.file);
        });
        image.crossOrigin="anonymous";            
        image.src=this.package.path+name+"@"+atlas.file;
        await loadprocess;
        this.package.textures[atlas.id]=atlas.texture;
    }
    CreateResourceComponent(component:any)
    {
        let own=this.package;
        component.type=EResourceType.Component;
        let id=component.id+".xml";
        let file=own.files[id];
        if(file) {
            component.component=file.data.component;
        }
        own.resources[component.name]=component;
        own.resources[component.id]=component;
    }

    async ParseResource()
    {
        let own=this.package;
        let item=own.files["package.xml"];
        console.log("ParseResource", item);

        let name=item.data.packageDescription.name;
        if(Array.isArray(item.data.packageDescription.resources.atlas)) {
            for(let atlas of item.data.packageDescription.resources.atlas) {
                await this.CreateAtlas(atlas, name);
            }
        }else {
            await this.CreateAtlas(item.data.packageDescription.resources.atlas, name);
        }
        if(Array.isArray(item.data.packageDescription.resources.component)) {
            for(let component of item.data.packageDescription.resources.component) {
                this.CreateResourceComponent(component);
            }
        }else {
            this.CreateResourceComponent(item.data.packageDescription.resources.component);
        }
        if(Array.isArray(item.data.packageDescription.resources.image)) {
            for(let image of item.data.packageDescription.resources.image) {
                image.type=EResourceType.Image;
                own.resources[image.name]=image;
                own.resources[image.id]=image;
            }
        }else {
            let image = item.data.packageDescription.resources.image;
            image.type=EResourceType.Image;
            own.resources[image.name]=image;
            own.resources[image.id]=image;
        }
    }
    ParseSprite()
    {
        let own=this.package;
        let item=own.files["sprites.bytes"];
        item.data.sprite=[];

        let sprites=item.source.split(/\r\n|\n/);
        for(let sprite of sprites) {
            if(sprite.startsWith("//"))
                continue;
            let rows=sprite.split(/ /);
            let atlas_name="atlas"+rows[1];
            let texture=own.textures[atlas_name];

            let sp:Sprite={
                id:rows[0],
                index:Number.parseInt(rows[1]),
                x:Number.parseInt(rows[2]),
                y:Number.parseInt(rows[3]),
                width:Number.parseInt(rows[4]),
                height:Number.parseInt(rows[5]),
                texture:texture,
                type:EResourceType.Sprite,
            }            
            item.data.sprite.push(sp);
            own.sprites[sp.id]=sp;
        }
        console.log(item);
    }

    package:FGUIPackage;
}

export class FGUIPackage
{
    constructor(path:string)
    {
        this.path=path;
    }

    async loadPackage(buffer:ArrayBuffer):Promise<FGUIPackage>  {
        let rd=new ByteBuffer(buffer);
        let header=rd.getInt32();
        if(header!=header_fgui) {
            let data = ZLIB.inflateRaw(buffer);
            let dec=new TextDecoder("utf-8");
            let xml=dec.decode(data);
            let parser=new FGUIXmlParser(this);
            await parser.Parse(xml);
        }
        console.log(this);
        return this;
    }
    Create(name:string, mgr:UIMgr):UIWin {
        let res=this.resources[name];
        let ui:UIWin=null;
        if(res) {
            ui=this.CreateFromResource(res, mgr);
        }
        return ui;
    }
    CreateFromResource(res:any, mgr:UIMgr):UIWin
    {
        let ui:UIWin=null;
        switch(res.type) {
        case EResourceType.Component:
            ui=this.CreateFromComponent(res, mgr);
            break;
        }
        return ui;
    }

    CreateWin(res:any, mgr:UIMgr):UIWin
    {
        let type:EUIType=EUIType.Win;
        let name=res.name;
        if(!name) {}
        else if(name.startsWith("btn_")) {
            type=EUIType.Button;        
        }else if(name.startsWith("pnl_")) {
            type=EUIType.Panel;
        }else if(name.startsWith("imagetext_")) {
            type=EUIType.ImageText;
        }
        if(res.component)   {
            if(res.component.Button || res.component.extention==="Button")  {
                type=EUIType.Button;
            }
        }

        let ui:UIWin=null;
        switch(type) {
        case EUIType.Win:
            ui=new UIWin(mgr);
            break;
        //case EUIType.Image:
        //    ui=new UIImage(mgr);
        //    break;
        case EUIType.Panel:
            let pnl=new UIPanel(mgr);
            pnl.isDrawClient=false;
            pnl.isDrawBorder=false;
            ui=pnl;
            break;
        case EUIType.Button:
            ui=new FGUIButton(mgr);
            break;
        case EUIType.ImageText:
            ui=new FGUIImageText(mgr);
            break;
        default:
            console.log(`TODO CreateWin type:${type}`, res);
            return null;
        }
        ui.Name=name;
        return ui;
    }
    SetAttribute(res:any, ui:UIWin)
    {
        for(let id in res) {
            let val=res[id];
            switch(id) {
            case "id":
            case "path":
            case "type":
            case "src":
            case "component":
            case "scale9grid":
            case "exported":
                break;
            case "name":
                ui.Name=val;
                break;
            case "xy":
                let pos=ParseVec2(val);
                ui.x=pos.x;
                ui.y=pos.y;
                ui.isCalRect=true;
                break;
            case "size":
                let size=ParseVec2(val);
                ui.w=size.x;
                ui.h=size.y;
                ui.isCalRect=true;
                break;
            case "visible":
                ui.isVisible=val;
                break;
            case "alpha": 
                // let img=ui as UIImage;
                // img.color=(img.color&0xFFFFFF)|((val*255)<<24);
                ui.SetAlpha(val);            
                break;
            case "scale":
                switch(val) {
                case "9grid": 
                    //CreateImage() handles 9grid
                    break;
                case "tile":
                    console.log("TODO scale:tile", val);
                    break;
                default:
                    let scale=ParseVec2(val);
                    // ui.w*=scale.x;
                    // ui.h*=scale.y;
                    // ui.isCalRect=true;        
                    break;
                }
                break;
            case "pivot":
                let v2=ParseVec2(val);
                ui.origin.Set(v2.x, v2.y);
                break;
            default:
                console.log("TODO SetAttribute:"+id, {res:res, value:val});
                break;
            }
        }
    }

    CreateImage(res:any, mgr:UIMgr):UIImage
    {
        let ui:UIImage=null;
        let scale_type=ScaleType(res.scale);
        if(res.src) {
            let src=this.resources[res.src];
            ui=this.CreateImage(src, mgr);
        }else {
            let sprite=this.sprites[res.id];
            switch(scale_type) {
            case EScaleType.None:
                ui=new UIImage(mgr);
                ui.image=toTexturePack(sprite);
                //console.log("CreateImage",res);
                break;
            case EScaleType.Grid9:
                let pnl=new UIPanel(mgr);
                pnl.rounding=0;
                pnl.borderWidth=0;
                pnl.isDrawClient=false;
                pnl.isDrawBorder=false;
                pnl.color=0xFFFFFFFF;
                let v4=ParseVec4(res.scale9grid);
                v4.z+=v4.x;
                v4.w+=v4.y;
                pnl.board={
                    x1:v4.x,
                    y1:v4.y,
                    x2:v4.z,
                    y2:v4.w,
                    image:toTexturePack(sprite),
                    type:BoardType.NineGrid
                }
                ui=pnl;
                break;
            case EScaleType.Tile:
                console.log("TODO CreateImage scale_type:"+scale_type, res);
                return ui;
            }
        }
        if(!ui)
            return ui;
        this.SetAttribute(res, ui);
        return ui;
    }

    CreateFromComponent(res:any, mgr:UIMgr):UIWin
    {
        let ui:UIWin=null;
        if(res.src) {
            let src=this.resources[res.src];
            ui=this.CreateFromComponent(src, mgr);
        }else {
            console.log("CreateFromComponent", res);
            ui=this.CreateWin(res, mgr);
        }
        if(!ui)
            return ui;
        this.SetAttribute(res, ui);
        if(!res.component)
            return ui;
        for(let component_id in res.component) {
            let component=res.component[component_id];
            switch(component_id) {
            case "displayList":
                for(let display_id in component)  {
                    let display=component[display_id];
                    switch(display_id) {
                    case "image":
                        if(Array.isArray(display)) {
                            for(let image of display) {
                                let img=this.CreateImage(image, mgr);
                                if(img) {
                                    ui.AddChild(img);
                                }    
                            }
                        }else {
                            let img=this.CreateImage(display, mgr);
                            if(img) {
                                ui.AddChild(img);
                            }
                        }
                        break;
                    case "component":
                        if(Array.isArray(display)) {
                            for(let obj of display)    {
                                let ch=this.CreateFromComponent(obj,mgr);
                                if(ch) {
                                    ui.AddChild(ch);
                                }
                            }
                        }else {
                            let ch=this.CreateFromComponent(display,mgr);
                            if(ch) {
                                ui.AddChild(ch);
                            }
                        }
                        break;
                    default:
                        console.log("TODO CreateFromComponent:" + display_id, display);        
                        break;
                    }
                }
                break;
            case "size":
            case "Button":
                break;
            default:
                console.log("TODO DisplayList:" + component_id, component);
                break;
            }
        }
        return ui;
    }

    version:number;
    path:string;
    files:{[key:string]:FGUIFile}={}
    textures:{[key:string]:ImGui_Impl.Texture}={}
    sprites:{[key:string]:Sprite}={}
    resources:{[key:string]:any}={}
}

export class FGUI
{
    static async Load(file:string, path:string):Promise<FGUIPackage>
    {
        return fetch(path+file).then(r=>{
            return r.arrayBuffer();
        }).then(b=>{
            let pkg=new FGUIPackage(path);
            return pkg.loadPackage(b);
        })
    }
}
