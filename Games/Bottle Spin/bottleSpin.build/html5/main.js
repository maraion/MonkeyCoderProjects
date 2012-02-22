
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}
	
	game_canvas=document.getElementById( "GameCanvas" );
	
	game_console=document.getElementById( "GameConsole" );

	try{
	
		bbInit();
		bbMain();
		
		if( game_runner!=null ) game_runner();
		
	}catch( err ){
	
		showError( err );
	}
}

var game_canvas;
var game_console;
var game_runner;

//${CONFIG_BEGIN}
CFG_CONFIG="debug";
CFG_HOST="winnt";
CFG_HTML5_SUSPEND_ON_BLUR_ENABLED="false";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="false";
CFG_PARSER_FUNC_ATTRS="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n[background.png];type=image/png;width=640;height=480;\n[bottle.png];type=image/png;width=93;height=299;\n";
//${METADATA_END}

function getMetaData( path,key ){
	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

function loadString( path ){
	var xhr=new XMLHttpRequest();
	xhr.open( "GET","data/"+path,false );
	xhr.send( null );
	if( (xhr.status==200) || (xhr.status==0) ) return xhr.responseText;
	return "";
}

function loadImage( path,onloadfun ){
	var ty=getMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;

	var image=new Image();
	
	image.meta_width=parseInt( getMetaData( path,"width" ) );
	image.meta_height=parseInt( getMetaData( path,"height" ) );
	image.onload=onloadfun;
	image.src="data/"+path;
	
	return image;
}

function loadAudio( path ){
	var audio=new Audio( "data/"+path );
	return audio;
}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	var str="";
	push_err();
	err_stack.reverse();
	for( var i=0;i<err_stack.length;++i ){
		str+=err_stack[i]+"\n";
	}
	err_stack.reverse();
	pop_err();
	return str;
}

function print( str ){
	if( game_console ){
		game_console.value+=str+"\n";
		game_console.scrollTop = game_console.scrollHeight - game_console.clientHeight;
	}
	if( window.console!=undefined ){
		window.console.log( str );
	}
}

function showError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	var t="Monkey runtime error: "+err+"\n"+stackTrace();
	if( window.console!=undefined ){
		window.console.log( t );
	}
	alert( t );
}

function error( err ){
	throw err;
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index>=0 && index<arr.length ) return arr;
	error( "Array index out of range" );
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_starts_with( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_ends_with( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_from_chars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}


function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

var gl=null;	//global WebGL context - a bit rude!

KEY_LMB=1;
KEY_RMB=2;
KEY_MMB=3;
KEY_TOUCH0=0x180;

function eatEvent( e ){
	if( e.stopPropagation ){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble=true;
		e.returnValue=false;
	}
}

function keyToChar( key ){
	switch( key ){
	case 8:
	case 9:
	case 13:
	case 27:
	case 32:
		return key;
	case 33:
	case 34:
	case 35:
	case 36:
	case 37:
	case 38:
	case 39:
	case 40:
	case 45:
		return key | 0x10000;
	case 46:
		return 127;
	}
	return 0;
}

//***** gxtkApp class *****

function gxtkApp(){

	if( typeof( CFG_OPENGL_GLES20_ENABLED )!="undefined" && CFG_OPENGL_GLES20_ENABLED=="true" ){
		this.gl=game_canvas.getContext( "webgl" );
		if( !this.gl ) this.gl=game_canvas.getContext( "experimental-webgl" );
	}else{
		this.gl=null;
	}

	this.graphics=new gxtkGraphics( this,game_canvas );
	this.input=new gxtkInput( this );
	this.audio=new gxtkAudio( this );

	this.loading=0;
	this.maxloading=0;

	this.updateRate=0;
	this.startMillis=(new Date).getTime();
	
	this.dead=false;
	this.suspended=false;
	
	var app=this;
	var canvas=game_canvas;
	
	function gxtkMain(){
	
		var input=app.input;
	
		canvas.onkeydown=function( e ){
			input.OnKeyDown( e.keyCode );
			var chr=keyToChar( e.keyCode );
			if( chr ) input.PutChar( chr );
			if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
		}

		canvas.onkeyup=function( e ){
			input.OnKeyUp( e.keyCode );
		}

		canvas.onkeypress=function( e ){
			if( e.charCode ){
				input.PutChar( e.charCode );
			}else if( e.which ){
				input.PutChar( e.which );
			}
		}

		canvas.onmousedown=function( e ){
			switch( e.button ){
			case 0:input.OnKeyDown( KEY_LMB );break;
			case 1:input.OnKeyDown( KEY_MMB );break;
			case 2:input.OnKeyDown( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseup=function( e ){
			switch( e.button ){
			case 0:input.OnKeyUp( KEY_LMB );break;
			case 1:input.OnKeyUp( KEY_MMB );break;
			case 2:input.OnKeyUp( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseout=function( e ){
			input.OnKeyUp( KEY_LMB );
			input.OnKeyUp( KEY_MMB );
			input.OnKeyUp( KEY_RMB );
			eatEvent( e );
		}

		canvas.onmousemove=function( e ){
			var x=e.clientX+document.body.scrollLeft;
			var y=e.clientY+document.body.scrollTop;
			var c=canvas;
			while( c ){
				x-=c.offsetLeft;
				y-=c.offsetTop;
				c=c.offsetParent;
			}
			input.OnMouseMove( x,y );
			eatEvent( e );
		}

		canvas.onfocus=function( e ){
			if( typeof( CFG_HTML5_SUSPEND_ON_BLUR_ENABLED )!="undefined" && CFG_HTML5_SUSPEND_ON_BLUR_ENABLED=="true" ){
				app.InvokeOnResume();
			}
		}
		
		canvas.onblur=function( e ){
			if( typeof( CFG_HTML5_SUSPEND_ON_BLUR_ENABLED )!="undefined" && CFG_HTML5_SUSPEND_ON_BLUR_ENABLED=="true" ){
				app.InvokeOnSuspend();
			}
		}
		
		canvas.ontouchstart=function( e ){
			for( var i=0;i<e.changedTouches.length;++i ){
				var touch=e.changedTouches[i];
				var x=touch.pageX;
				var y=touch.pageY;
				var c=canvas;
				while( c ){
					x-=c.offsetLeft;
					y-=c.offsetTop;
					c=c.offsetParent;
				}
				input.OnTouchStart( touch.identifier,x,y );
			}
			eatEvent( e );
		}
		
		canvas.ontouchmove=function( e ){
			for( var i=0;i<e.changedTouches.length;++i ){
				var touch=e.changedTouches[i];
				var x=touch.pageX;
				var y=touch.pageY;
				var c=canvas;
				while( c ){
					x-=c.offsetLeft;
					y-=c.offsetTop;
					c=c.offsetParent;
				}
				input.OnTouchMove( touch.identifier,x,y );
			}
			eatEvent( e );
		}
		
		canvas.ontouchend=function( e ){
			for( var i=0;i<e.changedTouches.length;++i ){
				input.OnTouchEnd( e.changedTouches[i].identifier );
			}
			eatEvent( e );
		}
		
		window.ondevicemotion=function( e ){
			var tx=e.accelerationIncludingGravity.x/9.81;
			var ty=e.accelerationIncludingGravity.y/9.81;
			var tz=e.accelerationIncludingGravity.z/9.81;
			var x,y;
			switch( window.orientation ){
			case   0:x=+tx;y=-ty;break;
			case 180:x=-tx;y=+ty;break;
			case  90:x=-ty;y=-tx;break;
			case -90:x=+ty;y=+tx;break;
			}
			input.OnDeviceMotion( x,y,tz );
			eatEvent( e );
		}

		canvas.focus();

		app.InvokeOnCreate();
		app.InvokeOnRender();
	}

	game_runner=gxtkMain;
}

var timerSeq=0;

gxtkApp.prototype.SetFrameRate=function( fps ){

	var seq=++timerSeq;
	
	if( !fps ) return;
	
	var app=this;
	var updatePeriod=1000.0/fps;
	var nextUpdate=(new Date).getTime()+updatePeriod;
	
	function timeElapsed(){
		if( seq!=timerSeq ) return;

		var time;		
		var updates=0;

		for(;;){
			nextUpdate+=updatePeriod;

			app.InvokeOnUpdate();
			if( seq!=timerSeq ) return;
			
			if( nextUpdate>(new Date).getTime() ) break;
			
			if( ++updates==7 ){
				nextUpdate=(new Date).getTime();
				break;
			}
		}
		app.InvokeOnRender();
		if( seq!=timerSeq ) return;
			
		var delay=nextUpdate-(new Date).getTime();
		setTimeout( timeElapsed,delay>0 ? delay : 0 );
	}
	
	setTimeout( timeElapsed,updatePeriod );
}

gxtkApp.prototype.IncLoading=function(){
	++this.loading;
	if( this.loading>this.maxloading ) this.maxloading=this.loading;
	if( this.loading==1 ) this.SetFrameRate( 0 );
}

gxtkApp.prototype.DecLoading=function(){
	--this.loading;
	if( this.loading!=0 ) return;
	this.maxloading=0;
	this.SetFrameRate( this.updateRate );
}

gxtkApp.prototype.GetMetaData=function( path,key ){
	return getMetaData( path,key );
}

gxtkApp.prototype.Die=function( err ){
	this.dead=true;
	this.audio.OnSuspend();
	showError( err );
}

gxtkApp.prototype.InvokeOnCreate=function(){
	if( this.dead ) return;
	
	try{
		gl=this.gl;
		this.OnCreate();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnUpdate=function(){
	if( this.dead || this.suspended || !this.updateRate || this.loading ) return;
	
	try{
		gl=this.gl;
		this.input.BeginUpdate();
		this.OnUpdate();		
		this.input.EndUpdate();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnSuspend=function(){
	if( this.dead || this.suspended ) return;
	
	try{
		gl=this.gl;
		this.suspended=true;
		this.OnSuspend();
		this.audio.OnSuspend();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnResume=function(){
	if( this.dead || !this.suspended ) return;
	
	try{
		gl=this.gl;
		this.audio.OnResume();
		this.OnResume();
		this.suspended=false;
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnRender=function(){
	if( this.dead || this.suspended ) return;
	
	try{
		gl=this.gl;
		this.graphics.BeginRender();
		if( this.loading ){
			this.OnLoading();
		}else{
			this.OnRender();
		}
		this.graphics.EndRender();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

//***** GXTK API *****

gxtkApp.prototype.GraphicsDevice=function(){
	return this.graphics;
}

gxtkApp.prototype.InputDevice=function(){
	return this.input;
}

gxtkApp.prototype.AudioDevice=function(){
	return this.audio;
}

gxtkApp.prototype.AppTitle=function(){
	return document.URL;
}

gxtkApp.prototype.LoadState=function(){
	var state=localStorage.getItem( ".mojostate@"+document.URL );
	if( state ) return state;
	return "";
}

gxtkApp.prototype.SaveState=function( state ){
	localStorage.setItem( ".mojostate@"+document.URL,state );
}

gxtkApp.prototype.LoadString=function( path ){
	return loadString( path );
}

gxtkApp.prototype.SetUpdateRate=function( fps ){
	this.updateRate=fps;
	
	if( !this.loading ) this.SetFrameRate( fps );
}

gxtkApp.prototype.MilliSecs=function(){
	return ((new Date).getTime()-this.startMillis)|0;
}

gxtkApp.prototype.Loading=function(){
	return this.loading;
}

gxtkApp.prototype.OnCreate=function(){
}

gxtkApp.prototype.OnUpdate=function(){
}

gxtkApp.prototype.OnSuspend=function(){
}

gxtkApp.prototype.OnResume=function(){
}

gxtkApp.prototype.OnRender=function(){
}

gxtkApp.prototype.OnLoading=function(){
}

//***** gxtkGraphics class *****

function gxtkGraphics( app,canvas ){
	this.app=app;
	this.canvas=canvas;
	this.gc=canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	if( this.gc ) this.gc.save();
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Mode=function(){
	if( this.gc ) return 1;
	return 0;
}

gxtkGraphics.prototype.Width=function(){
	return this.canvas.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.canvas.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var app=this.app;
	
	function onloadfun(){
		app.DecLoading();
	}

	app.IncLoading();

	var image=loadImage( path,onloadfun );
	if( image ) return new gxtkSurface( image,this );

	app.DecLoading();
	return null;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<6 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tgc=this.tmpCanvas.getContext( "2d" );
	
	tgc.globalCompositeOperation="copy";

	tgc.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tgc.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tgc.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

//***** Class gxtkInput *****

function gxtkInput( app ){
	this.app=app;
	this.keyStates=new Array( 512 );
	this.charQueue=new Array( 32 );
	this.charPut=0;
	this.charGet=0;
	this.mouseX=0;
	this.mouseY=0;
	this.joyX=0;
	this.joyY=0;
	this.joyZ=0;
	this.touchIds=new Array( 32 );
	this.touchXs=new Array( 32 );
	this.touchYs=new Array( 32 );
	this.accelX=0;
	this.accelY=0;
	this.accelZ=0;
	
	var i;
	
	for( i=0;i<512;++i ){
		this.keyStates[i]=0;
	}
	
	for( i=0;i<32;++i ){
		this.touchIds[i]=-1;
		this.touchXs[i]=0;
		this.touchYs[i]=0;
	}
}

gxtkInput.prototype.BeginUpdate=function(){
}

gxtkInput.prototype.EndUpdate=function(){
	for( var i=0;i<512;++i ){
		this.keyStates[i]&=0x100;
	}
	this.charGet=0;
	this.charPut=0;
}

gxtkInput.prototype.OnKeyDown=function( key ){
	if( (this.keyStates[key]&0x100)==0 ){
		this.keyStates[key]|=0x100;
		++this.keyStates[key];
		//
		if( key==KEY_LMB ){
			this.keyStates[KEY_TOUCH0]|=0x100;
			++this.keyStates[KEY_TOUCH0];
		}else if( key==KEY_TOUCH0 ){
			this.keyStates[KEY_LMB]|=0x100;
			++this.keyStates[KEY_LMB];
		}
		//
	}
}

gxtkInput.prototype.OnKeyUp=function( key ){
	this.keyStates[key]&=0xff;
	//
	if( key==KEY_LMB ){
		this.keyStates[KEY_TOUCH0]&=0xff;
	}else if( key==KEY_TOUCH0 ){
		this.keyStates[KEY_LMB]&=0xff;
	}
	//
}

gxtkInput.prototype.PutChar=function( chr ){
	if( this.charPut-this.charGet<32 ){
		this.charQueue[this.charPut & 31]=chr;
		this.charPut+=1;
	}
}

gxtkInput.prototype.OnMouseMove=function( x,y ){
	this.mouseX=x;
	this.mouseY=y;
	this.touchXs[0]=x;
	this.touchYs[0]=y;
}

gxtkInput.prototype.OnTouchStart=function( id,x,y ){
	for( var i=0;i<32;++i ){
		if( this.touchIds[i]==-1 ){
			this.touchIds[i]=id;
			this.touchXs[i]=x;
			this.touchYs[i]=y;
			this.OnKeyDown( KEY_TOUCH0+i );
			return;
		} 
	}
}

gxtkInput.prototype.OnTouchMove=function( id,x,y ){
	for( var i=0;i<32;++i ){
		if( this.touchIds[i]==id ){
			this.touchXs[i]=x;
			this.touchYs[i]=y;
			if( i==0 ){
				this.mouseX=x;
				this.mouseY=y;
			}
			return;
		}
	}
}

gxtkInput.prototype.OnTouchEnd=function( id ){
	for( var i=0;i<32;++i ){
		if( this.touchIds[i]==id ){
			this.touchIds[i]=-1;
			this.OnKeyUp( KEY_TOUCH0+i );
			return;
		}
	}
}

gxtkInput.prototype.OnDeviceMotion=function( x,y,z ){
	this.accelX=x;
	this.accelY=y;
	this.accelZ=z;
}

//***** GXTK API *****

gxtkInput.prototype.SetKeyboardEnabled=function( enabled ){
	return 0;
}

gxtkInput.prototype.KeyDown=function( key ){
	if( key>0 && key<512 ){
		return this.keyStates[key] >> 8;
	}
	return 0;
}

gxtkInput.prototype.KeyHit=function( key ){
	if( key>0 && key<512 ){
		return this.keyStates[key] & 0xff;
	}
	return 0;
}

gxtkInput.prototype.GetChar=function(){
	if( this.charPut!=this.charGet ){
		var chr=this.charQueue[this.charGet & 31];
		this.charGet+=1;
		return chr;
	}
	return 0;
}

gxtkInput.prototype.MouseX=function(){
	return this.mouseX;
}

gxtkInput.prototype.MouseY=function(){
	return this.mouseY;
}

gxtkInput.prototype.JoyX=function( index ){
	return this.joyX;
}

gxtkInput.prototype.JoyY=function( index ){
	return this.joyY;
}

gxtkInput.prototype.JoyZ=function( index ){
	return this.joyZ;
}

gxtkInput.prototype.TouchX=function( index ){
	return this.touchXs[index];
}

gxtkInput.prototype.TouchY=function( index ){
	return this.touchYs[index];
}

gxtkInput.prototype.AccelX=function(){
	return this.accelX;
}

gxtkInput.prototype.AccelY=function(){
	return this.accelY;
}

gxtkInput.prototype.AccelZ=function(){
	return this.accelZ;
}


//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio( app ){
	this.app=app;
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.OnSuspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.pause();
	}
}

gxtkAudio.prototype.OnResume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	var audio=loadAudio( path );
	if( audio ) return new gxtkSample( audio );
	return null;
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;

	var chan=this.channels[channel];

	if( chan.state!=0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;
	
	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state!=0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state!=0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.Discard=function(){
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}
function bb_app_App(){
	Object.call(this);
}
function bb_app_App_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<105>";
	bb_app_device=bb_app_AppDevice_new.call(new bb_app_AppDevice,this);
	pop_err();
	return this;
}
bb_app_App.prototype.m_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
function bb_bottleSpin_Game(){
	bb_app_App.call(this);
	this.f_aspectRatio=.0;
	this.f_centerX=.0;
	this.f_centerY=.0;
	this.f_bottleImage=null;
	this.f_backgroundImage=null;
	this.f_tweenRotation=null;
	this.f_rotating=false;
	this.f_direction=0;
	this.f_tmpRot=.0;
	this.f_rotation=90.0;
}
bb_bottleSpin_Game.prototype=extend_class(bb_app_App);
function bb_bottleSpin_Game_new(){
	push_err();
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<13>";
	bb_app_App_new.call(this);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<13>";
	pop_err();
	return this;
}
bb_bottleSpin_Game.prototype.m_OnCreate=function(){
	push_err();
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<28>";
	bb_app_App.prototype.m_OnCreate.call(this);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<30>";
	bb_autofit_SetVirtualDisplay(320,480,1.0);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<31>";
	this.f_aspectRatio=((bb_graphics_DeviceWidth()/bb_graphics_DeviceHeight())|0);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<33>";
	this.f_centerX=bb_autofit_VDeviceWidth()/2.0;
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<34>";
	this.f_centerY=bb_autofit_VDeviceHeight()/2.0;
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<36>";
	this.f_bottleImage=bb_graphics_LoadImage("bottle.png",1,1);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<37>";
	this.f_backgroundImage=bb_graphics_LoadImage("background.png",1,1);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<39>";
	bb_app_SetUpdateRate(60);
	pop_err();
	return 0;
}
bb_bottleSpin_Game.prototype.m_OnUpdate=function(){
	push_err();
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<43>";
	bb_app_App.prototype.m_OnUpdate.call(this);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<44>";
	if((this.f_tweenRotation)!=null){
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<44>";
		this.f_tweenRotation.m_Update();
	}
	pop_err();
	return 0;
}
bb_bottleSpin_Game.prototype.m_OnRender=function(){
	push_err();
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<48>";
	bb_autofit_UpdateVirtualDisplay(true,true);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<50>";
	bb_graphics_DrawImage(this.f_backgroundImage,bb_autofit_VDeviceWidth()/2.0,bb_autofit_VDeviceHeight()/2.0,0);
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<52>";
	if((bb_input_MouseDown(0))!=0){
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<53>";
		if(this.f_rotating){
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<54>";
			this.f_rotating=false;
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<55>";
			this.f_direction=0;
		}
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<57>";
		this.f_tmpRot=bb_math_Abs2(Math.atan((bb_autofit_VMouseY(true)-this.f_centerY)/(bb_autofit_VMouseX(true)-this.f_centerX))*R2D);
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<60>";
		if(bb_autofit_VMouseX(true)<this.f_centerX && bb_autofit_VMouseY(true)<this.f_centerY){
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<61>";
			this.f_tmpRot=180.0-this.f_tmpRot;
		}else{
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<63>";
			if(bb_autofit_VMouseX(true)<this.f_centerX && bb_autofit_VMouseY(true)>this.f_centerY){
				err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<64>";
				this.f_tmpRot=180.0+this.f_tmpRot;
			}else{
				err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<66>";
				if(bb_autofit_VMouseX(true)>this.f_centerX && bb_autofit_VMouseY(true)>this.f_centerY){
					err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<67>";
					this.f_tmpRot=360.0-this.f_tmpRot;
				}
			}
		}
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<70>";
		if(this.f_tmpRot<45.0 && this.f_rotation>315.0){
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<71>";
			this.f_direction=(((this.f_direction)+(360.0+this.f_tmpRot-this.f_rotation))|0);
		}else{
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<73>";
			this.f_direction=(((this.f_direction)+(this.f_tmpRot-this.f_rotation))|0);
		}
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<76>";
		if(this.f_rotation<this.f_tmpRot){
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<77>";
			this.f_direction=1;
		}else{
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<79>";
			this.f_direction=-1;
		}
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<82>";
		this.f_rotation=this.f_tmpRot;
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<83>";
	}else{
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<85>";
		if(this.f_direction!=0 && !this.f_rotating){
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<86>";
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<87>";
			this.f_rotating=true;
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<88>";
			if((this.f_tweenRotation)!=null){
				err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<88>";
				this.f_tweenRotation.m_Stop();
			}
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<90>";
			var t_spin=((this.f_rotation+bb_random_Rnd2(480.0,1080.0)*(this.f_direction))|0);
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<91>";
			var t_time=((bb_math_Abs2((t_spin)-this.f_rotation)/360.0*4500.0)|0);
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<93>";
			this.f_tweenRotation=bb_tween_Tween_new.call(new bb_tween_Tween,dbg_object(bb_tween_Tween_Expo).f_EaseOut,this.f_rotation,(t_spin),t_time);
			err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<94>";
			this.f_tweenRotation.m_Start();
		}
	}
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<97>";
	if(this.f_rotating){
		err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<97>";
		this.f_rotation=this.f_tweenRotation.m_Value();
	}
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<99>";
	bb_graphics_DrawImage2(this.f_bottleImage,bb_autofit_VDeviceWidth()/2.0,bb_autofit_VDeviceHeight()/2.0,this.f_rotation-90.0,1.0,1.0,0);
	pop_err();
	return 0;
}
function bb_app_AppDevice(){
	gxtkApp.call(this);
	this.f_app=null;
	this.f_updateRate=0;
}
bb_app_AppDevice.prototype=extend_class(gxtkApp);
function bb_app_AppDevice_new(t_app){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<45>";
	dbg_object(this).f_app=t_app;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<46>";
	bb_graphics_SetGraphicsContext(bb_graphics_GraphicsContext_new.call(new bb_graphics_GraphicsContext,this.GraphicsDevice()));
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<47>";
	bb_input_SetInputDevice(this.InputDevice());
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<48>";
	bb_audio_SetAudioDevice(this.AudioDevice());
	pop_err();
	return this;
}
function bb_app_AppDevice_new2(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<42>";
	pop_err();
	return this;
}
bb_app_AppDevice.prototype.OnCreate=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<52>";
	bb_graphics_SetFont(null,32);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<53>";
	var t_=this.f_app.m_OnCreate();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnUpdate=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<57>";
	var t_=this.f_app.m_OnUpdate();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnSuspend=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<61>";
	var t_=this.f_app.m_OnSuspend();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnResume=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<65>";
	var t_=this.f_app.m_OnResume();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnRender=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<69>";
	bb_graphics_BeginRender();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<70>";
	var t_r=this.f_app.m_OnRender();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<71>";
	bb_graphics_EndRender();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<72>";
	pop_err();
	return t_r;
}
bb_app_AppDevice.prototype.OnLoading=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<76>";
	bb_graphics_BeginRender();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<77>";
	var t_r=this.f_app.m_OnLoading();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<78>";
	bb_graphics_EndRender();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<79>";
	pop_err();
	return t_r;
}
bb_app_AppDevice.prototype.SetUpdateRate=function(t_hertz){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<83>";
	gxtkApp.prototype.SetUpdateRate.call(this,t_hertz);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<84>";
	this.f_updateRate=t_hertz;
	pop_err();
	return 0;
}
function bb_graphics_GraphicsContext(){
	Object.call(this);
	this.f_device=null;
	this.f_defaultFont=null;
	this.f_font=null;
	this.f_firstChar=0;
	this.f_matrixSp=0;
	this.f_ix=1.0;
	this.f_iy=.0;
	this.f_jx=.0;
	this.f_jy=1.0;
	this.f_tx=.0;
	this.f_ty=.0;
	this.f_tformed=0;
	this.f_matDirty=0;
	this.f_color_r=.0;
	this.f_color_g=.0;
	this.f_color_b=.0;
	this.f_alpha=.0;
	this.f_blend=0;
	this.f_scissor_x=.0;
	this.f_scissor_y=.0;
	this.f_scissor_width=.0;
	this.f_scissor_height=.0;
	this.f_matrixStack=new_number_array(192);
}
function bb_graphics_GraphicsContext_new(t_device){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<211>";
	dbg_object(this).f_device=t_device;
	pop_err();
	return this;
}
function bb_graphics_GraphicsContext_new2(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<208>";
	pop_err();
	return this;
}
var bb_graphics_context;
function bb_graphics_SetGraphicsContext(t_gc){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<251>";
	bb_graphics_context=t_gc;
	pop_err();
	return 0;
}
var bb_input_device;
function bb_input_SetInputDevice(t_dev){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/input.monkey<40>";
	bb_input_device=t_dev;
	pop_err();
	return 0;
}
var bb_audio_device;
function bb_audio_SetAudioDevice(t_dev){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/audio.monkey<60>";
	bb_audio_device=t_dev;
	pop_err();
	return 0;
}
var bb_app_device;
function bbMain(){
	push_err();
	err_info="C:/Users/Nibiru/git/MonkeyCoderProjects/Games/bottleSpin.monkey<105>";
	bb_bottleSpin_Game_new.call(new bb_bottleSpin_Game);
	pop_err();
	return 0;
}
function bb_graphics_Image(){
	Object.call(this);
	this.f_surface=null;
	this.f_width=0;
	this.f_height=0;
	this.f_frames=[];
	this.f_flags=0;
	this.f_tx=.0;
	this.f_ty=.0;
	this.f_source=null;
}
var bb_graphics_Image_DefaultFlags;
function bb_graphics_Image_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<64>";
	pop_err();
	return this;
}
bb_graphics_Image.prototype.m_SetHandle=function(t_tx,t_ty){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<110>";
	dbg_object(this).f_tx=t_tx;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<111>";
	dbg_object(this).f_ty=t_ty;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<112>";
	dbg_object(this).f_flags=dbg_object(this).f_flags&-2;
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.m_ApplyFlags=function(t_iflags){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<181>";
	this.f_flags=t_iflags;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<183>";
	if((this.f_flags&2)!=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<184>";
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<184>";
		var t_=this.f_frames;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<184>";
		var t_2=0;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<184>";
		while(t_2<t_.length){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<184>";
			var t_f=dbg_array(t_,t_2)[t_2];
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<184>";
			t_2=t_2+1;
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<185>";
			dbg_object(t_f).f_x+=1;
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<187>";
		this.f_width-=2;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<190>";
	if((this.f_flags&4)!=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<191>";
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<191>";
		var t_3=this.f_frames;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<191>";
		var t_4=0;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<191>";
		while(t_4<t_3.length){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<191>";
			var t_f2=dbg_array(t_3,t_4)[t_4];
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<191>";
			t_4=t_4+1;
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<192>";
			dbg_object(t_f2).f_y+=1;
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<194>";
		this.f_height-=2;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<197>";
	if((this.f_flags&1)!=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<198>";
		this.m_SetHandle((this.f_width)/2.0,(this.f_height)/2.0);
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<201>";
	if(this.f_frames.length==1 && dbg_object(dbg_array(this.f_frames,0)[0]).f_x==0 && dbg_object(dbg_array(this.f_frames,0)[0]).f_y==0 && this.f_width==this.f_surface.Width() && this.f_height==this.f_surface.Height()){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<202>";
		this.f_flags|=65536;
	}
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.m_Load=function(t_path,t_nframes,t_iflags){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<133>";
	this.f_surface=dbg_object(bb_graphics_context).f_device.LoadSurface(t_path);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<134>";
	if(!((this.f_surface)!=null)){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<134>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<136>";
	this.f_width=((this.f_surface.Width()/t_nframes)|0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<137>";
	this.f_height=this.f_surface.Height();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<139>";
	this.f_frames=new_object_array(t_nframes);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<141>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<142>";
		dbg_array(this.f_frames,t_i)[t_i]=bb_graphics_Frame_new.call(new bb_graphics_Frame,t_i*this.f_width,0)
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<145>";
	this.m_ApplyFlags(t_iflags);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<147>";
	pop_err();
	return this;
}
bb_graphics_Image.prototype.m_Grab=function(t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_source){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<152>";
	dbg_object(this).f_source=t_source;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<153>";
	this.f_surface=dbg_object(t_source).f_surface;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<155>";
	this.f_width=t_iwidth;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<156>";
	this.f_height=t_iheight;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<158>";
	this.f_frames=new_object_array(t_nframes);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<160>";
	var t_ix=t_x+dbg_object(dbg_array(dbg_object(t_source).f_frames,0)[0]).f_x;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<161>";
	var t_iy=t_y+dbg_object(dbg_array(dbg_object(t_source).f_frames,0)[0]).f_y;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<163>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<164>";
		if(t_ix+this.f_width>dbg_object(t_source).f_width){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<165>";
			t_ix=dbg_object(dbg_array(dbg_object(t_source).f_frames,0)[0]).f_x;
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<166>";
			t_iy+=this.f_height;
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<168>";
		if(t_ix+this.f_width>dbg_object(t_source).f_width || t_iy+this.f_height>dbg_object(t_source).f_height){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<169>";
			error("Image frame outside surface");
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<171>";
		dbg_array(this.f_frames,t_i)[t_i]=bb_graphics_Frame_new.call(new bb_graphics_Frame,t_ix,t_iy)
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<172>";
		t_ix+=this.f_width;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<175>";
	this.m_ApplyFlags(t_iflags);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<177>";
	pop_err();
	return this;
}
bb_graphics_Image.prototype.m_GrabImage=function(t_x,t_y,t_width,t_height,t_frames,t_flags){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<105>";
	if(dbg_object(this).f_frames.length!=1){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<105>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<106>";
	var t_=(bb_graphics_Image_new.call(new bb_graphics_Image)).m_Grab(t_x,t_y,t_width,t_height,t_frames,t_flags,this);
	pop_err();
	return t_;
}
function bb_graphics_Frame(){
	Object.call(this);
	this.f_x=0;
	this.f_y=0;
}
function bb_graphics_Frame_new(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<56>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<57>";
	dbg_object(this).f_y=t_y;
	pop_err();
	return this;
}
function bb_graphics_Frame_new2(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<51>";
	pop_err();
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<278>";
	var t_=(bb_graphics_Image_new.call(new bb_graphics_Image)).m_Load(t_path,t_frameCount,t_flags);
	pop_err();
	return t_;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<282>";
	var t_atlas=(bb_graphics_Image_new.call(new bb_graphics_Image)).m_Load(t_path,1,0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<283>";
	if((t_atlas)!=null){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<283>";
		var t_=t_atlas.m_GrabImage(0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<553>";
	if(!((t_font)!=null)){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<554>";
		if(!((dbg_object(bb_graphics_context).f_defaultFont)!=null)){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<555>";
			dbg_object(bb_graphics_context).f_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<557>";
		t_font=dbg_object(bb_graphics_context).f_defaultFont;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<558>";
		t_firstChar=32;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<560>";
	dbg_object(bb_graphics_context).f_font=t_font;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<561>";
	dbg_object(bb_graphics_context).f_firstChar=t_firstChar;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<332>";
	dbg_object(bb_graphics_context).f_ix=t_ix;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<333>";
	dbg_object(bb_graphics_context).f_iy=t_iy;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<334>";
	dbg_object(bb_graphics_context).f_jx=t_jx;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<335>";
	dbg_object(bb_graphics_context).f_jy=t_jy;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<336>";
	dbg_object(bb_graphics_context).f_tx=t_tx;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<337>";
	dbg_object(bb_graphics_context).f_ty=t_ty;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<338>";
	dbg_object(bb_graphics_context).f_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<339>";
	dbg_object(bb_graphics_context).f_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<328>";
	bb_graphics_SetMatrix(dbg_array(t_m,0)[0],dbg_array(t_m,1)[1],dbg_array(t_m,2)[2],dbg_array(t_m,3)[3],dbg_array(t_m,4)[4],dbg_array(t_m,5)[5]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<287>";
	dbg_object(bb_graphics_context).f_color_r=t_r;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<288>";
	dbg_object(bb_graphics_context).f_color_g=t_g;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<289>";
	dbg_object(bb_graphics_context).f_color_b=t_b;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<290>";
	dbg_object(bb_graphics_context).f_device.SetColor(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<298>";
	dbg_object(bb_graphics_context).f_alpha=t_alpha;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<299>";
	dbg_object(bb_graphics_context).f_device.SetAlpha(t_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<307>";
	dbg_object(bb_graphics_context).f_blend=t_blend;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<308>";
	dbg_object(bb_graphics_context).f_device.SetBlend(t_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<270>";
	var t_=dbg_object(bb_graphics_context).f_device.Width();
	pop_err();
	return t_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<274>";
	var t_=dbg_object(bb_graphics_context).f_device.Height();
	pop_err();
	return t_;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<316>";
	dbg_object(bb_graphics_context).f_scissor_x=t_x;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<317>";
	dbg_object(bb_graphics_context).f_scissor_y=t_y;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<318>";
	dbg_object(bb_graphics_context).f_scissor_width=t_width;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<319>";
	dbg_object(bb_graphics_context).f_scissor_height=t_height;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<320>";
	dbg_object(bb_graphics_context).f_device.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<255>";
	if(!((dbg_object(bb_graphics_context).f_device.Mode())!=0)){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<255>";
		pop_err();
		return 0;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<256>";
	bb_graphics_renderDevice=dbg_object(bb_graphics_context).f_device;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<257>";
	dbg_object(bb_graphics_context).f_matrixSp=0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<258>";
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<259>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<260>";
	bb_graphics_SetAlpha(1.0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<261>";
	bb_graphics_SetBlend(0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<262>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<266>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
function bb_autofit_VirtualDisplay(){
	Object.call(this);
	this.f_vwidth=.0;
	this.f_vheight=.0;
	this.f_vzoom=.0;
	this.f_vratio=.0;
	this.f_fdw=.0;
	this.f_fdh=.0;
	this.f_multi=.0;
	this.f_heightborder=.0;
	this.f_widthborder=.0;
	this.f_scaledw=.0;
	this.f_scaledh=.0;
}
var bb_autofit_VirtualDisplay_Display;
function bb_autofit_VirtualDisplay_new(t_width,t_height,t_zoom){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<230>";
	this.f_vwidth=(t_width);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<231>";
	this.f_vheight=(t_height);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<233>";
	this.f_vzoom=t_zoom;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<237>";
	this.f_vratio=this.f_vheight/this.f_vwidth;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<241>";
	bb_autofit_VirtualDisplay_Display=this;
	pop_err();
	return this;
}
function bb_autofit_VirtualDisplay_new2(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<187>";
	pop_err();
	return this;
}
bb_autofit_VirtualDisplay.prototype.m_UpdateVirtualDisplay=function(t_zoomborders,t_keepborders){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<328>";
	this.f_fdw=(bb_graphics_DeviceWidth());
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<329>";
	this.f_fdh=(bb_graphics_DeviceHeight());
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<334>";
	var t_dratio=this.f_fdh/this.f_fdw;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<338>";
	if(t_dratio>=this.f_vratio){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<347>";
		this.f_multi=this.f_fdw/this.f_vwidth;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<351>";
		this.f_heightborder=(this.f_fdh-this.f_vheight*this.f_multi)*0.5;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<352>";
		this.f_widthborder=0.0;
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<363>";
		this.f_multi=this.f_fdh/this.f_vheight;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<367>";
		this.f_widthborder=(this.f_fdw-this.f_vwidth*this.f_multi)*0.5;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<368>";
		this.f_heightborder=0.0;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<376>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<377>";
	bb_graphics_Cls(0.0,0.0,0.0);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<383>";
	var t_sx=.0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<383>";
	var t_sy=.0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<383>";
	var t_sw=.0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<383>";
	var t_sh=.0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<385>";
	if(t_zoomborders){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<389>";
		var t_realx=this.f_vwidth*this.f_vzoom*this.f_multi;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<390>";
		var t_realy=this.f_vheight*this.f_vzoom*this.f_multi;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<394>";
		var t_offx=(this.f_fdw-t_realx)*0.5;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<395>";
		var t_offy=(this.f_fdh-t_realy)*0.5;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<400>";
		if(t_keepborders){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<402>";
			if(t_offx<this.f_widthborder){
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<403>";
				t_sx=this.f_widthborder;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<404>";
				t_sw=this.f_fdw-this.f_widthborder*2.0;
			}else{
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<406>";
				t_sx=t_offx;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<407>";
				t_sw=this.f_fdw-t_offx*2.0;
			}
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<412>";
			t_sx=t_offx;
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<413>";
			t_sw=this.f_fdw-t_offx*2.0;
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<417>";
		if(t_keepborders){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<419>";
			if(t_offy<this.f_heightborder){
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<420>";
				t_sy=this.f_heightborder;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<421>";
				t_sh=this.f_fdh-this.f_heightborder*2.0;
			}else{
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<423>";
				t_sy=t_offy;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<424>";
				t_sh=this.f_fdh-t_offy*2.0;
			}
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<429>";
			t_sy=t_offy;
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<430>";
			t_sh=this.f_fdh-t_offy*2.0;
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<434>";
		t_sx=bb_math_Max2(0.0,t_sx);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<435>";
		t_sy=bb_math_Max2(0.0,t_sy);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<436>";
		t_sw=bb_math_Min2(t_sw,this.f_fdw);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<437>";
		t_sh=bb_math_Min2(t_sh,this.f_fdh);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<439>";
		bb_graphics_SetScissor(t_sx,t_sy,t_sw,t_sh);
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<443>";
		t_sx=bb_math_Max2(0.0,this.f_widthborder);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<444>";
		t_sy=bb_math_Max2(0.0,this.f_heightborder);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<445>";
		t_sw=bb_math_Min2(this.f_fdw-this.f_widthborder*2.0,this.f_fdw);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<446>";
		t_sh=bb_math_Min2(this.f_fdh-this.f_heightborder*2.0,this.f_fdh);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<448>";
		bb_graphics_SetScissor(t_sx,t_sy,t_sw,t_sh);
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<456>";
	bb_graphics_Scale(this.f_multi*this.f_vzoom,this.f_multi*this.f_vzoom);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<462>";
	if((this.f_vzoom)!=0.0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<466>";
		this.f_scaledw=this.f_vwidth*this.f_multi*this.f_vzoom;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<467>";
		this.f_scaledh=this.f_vheight*this.f_multi*this.f_vzoom;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<471>";
		var t_xoff=(this.f_fdw-this.f_scaledw)*0.5;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<472>";
		var t_yoff=(this.f_fdh-this.f_scaledh)*0.5;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<476>";
		t_xoff=t_xoff/this.f_multi/this.f_vzoom;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<477>";
		t_yoff=t_yoff/this.f_multi/this.f_vzoom;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<481>";
		bb_graphics_Translate(t_xoff,t_yoff);
	}
	pop_err();
	return 0;
}
bb_autofit_VirtualDisplay.prototype.m_VMouseY=function(t_limit){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<295>";
	var t_mouseoffset=bb_input_MouseY()-(bb_graphics_DeviceHeight())*0.5;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<299>";
	var t_y=t_mouseoffset/this.f_multi/this.f_vzoom+bb_autofit_VDeviceHeight()*0.5;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<303>";
	if(t_limit){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<305>";
		var t_heightlimit=this.f_vheight-1.0;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<307>";
		if(t_y>0.0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<308>";
			if(t_y<t_heightlimit){
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<309>";
				pop_err();
				return t_y;
			}else{
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<311>";
				pop_err();
				return t_heightlimit;
			}
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<314>";
			pop_err();
			return 0.0;
		}
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<318>";
		pop_err();
		return t_y;
	}
}
bb_autofit_VirtualDisplay.prototype.m_VMouseX=function(t_limit){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<263>";
	var t_mouseoffset=bb_input_MouseX()-(bb_graphics_DeviceWidth())*0.5;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<267>";
	var t_x=t_mouseoffset/this.f_multi/this.f_vzoom+bb_autofit_VDeviceWidth()*0.5;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<271>";
	if(t_limit){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<273>";
		var t_widthlimit=this.f_vwidth-1.0;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<275>";
		if(t_x>0.0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<276>";
			if(t_x<t_widthlimit){
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<277>";
				pop_err();
				return t_x;
			}else{
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<279>";
				pop_err();
				return t_widthlimit;
			}
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<282>";
			pop_err();
			return 0.0;
		}
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<286>";
		pop_err();
		return t_x;
	}
}
function bb_autofit_SetVirtualDisplay(t_width,t_height,t_zoom){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<89>";
	bb_autofit_VirtualDisplay_new.call(new bb_autofit_VirtualDisplay,t_width,t_height,t_zoom);
	pop_err();
	return 0;
}
function bb_autofit_VDeviceWidth(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<170>";
	pop_err();
	return dbg_object(bb_autofit_VirtualDisplay_Display).f_vwidth;
}
function bb_autofit_VDeviceHeight(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<174>";
	pop_err();
	return dbg_object(bb_autofit_VirtualDisplay_Display).f_vheight;
}
function bb_app_SetUpdateRate(t_hertz){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<141>";
	var t_=bb_app_device.SetUpdateRate(t_hertz);
	pop_err();
	return t_;
}
function bb_tween_Tween(){
	Object.call(this);
	this.f_isActive=false;
	this.f_timeCurrent=0;
	this.f_timePrevious=0;
	this.f_timeStart=0;
	this.f_duration=0;
	this.f_isLooping=false;
	this.f_isYoYo=false;
	this.f_loopCount=0;
	this.f_start=.0;
	this.f_change=.0;
	this.f_current=.0;
	this.f_equation=null;
}
bb_tween_Tween.prototype.m_SetValue=function(t_startValue,t_endValue){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<70>";
	this.f_start=t_startValue;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<71>";
	this.f_change=t_endValue-t_startValue;
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_Stop=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<92>";
	this.f_isActive=false;
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_SetDuration=function(t_duration){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<66>";
	dbg_object(this).f_duration=t_duration;
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_UpdateValue=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<51>";
	this.f_current=this.f_equation.m_Call((this.f_timeCurrent),this.f_start,this.f_change,(this.f_duration));
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_Rewind=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<105>";
	this.f_timeCurrent=0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<106>";
	this.f_timeStart=bb_app_Millisecs();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<107>";
	this.m_UpdateValue();
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_Start=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<85>";
	this.m_Rewind();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<86>";
	this.f_isActive=true;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<87>";
	this.f_loopCount=0;
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_ContinueTo=function(t_endValue,t_duration){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<119>";
	this.f_start=this.f_current;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<120>";
	this.m_SetValue(this.f_start,t_endValue);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<122>";
	if(this.f_isActive){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<124>";
		if(t_duration==0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<126>";
			dbg_object(this).f_duration=t_duration-this.f_timeCurrent;
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<129>";
			dbg_object(this).f_duration=t_duration;
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<132>";
		this.f_timeStart=bb_app_Millisecs();
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<133>";
		this.f_timeCurrent=0;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<135>";
		if(t_duration<=0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<136>";
			t_duration=0;
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<137>";
			this.m_Stop();
		}
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<140>";
		if(t_duration>0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<140>";
			this.m_SetDuration(t_duration);
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<141>";
		this.m_Start();
	}
	pop_err();
	return 0;
}
bb_tween_Tween.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<151>";
	if(this.f_isActive){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<153>";
		this.f_timePrevious=this.f_timeCurrent;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<154>";
		var t_time=bb_app_Millisecs()-this.f_timeStart;
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<155>";
		if(t_time>this.f_duration){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<157>";
			if(this.f_isLooping || this.f_isYoYo){
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<159>";
				this.f_loopCount+=1;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<162>";
				if(this.f_isYoYo){
					err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<163>";
					this.f_timeCurrent=this.f_duration;
					err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<164>";
					this.f_current=this.f_start+this.f_change;
					err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<166>";
					if(this.f_isLooping || this.f_loopCount<=1){
						err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<167>";
						this.m_ContinueTo(this.f_start,this.f_duration);
					}else{
						err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<169>";
						this.m_Stop();
					}
				}else{
					err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<173>";
					this.f_timeCurrent=0;
					err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<174>";
					this.f_timeStart=bb_app_Millisecs();
				}
			}else{
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<178>";
				this.f_timeCurrent=this.f_duration;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<179>";
				this.f_current=this.f_start+this.f_change;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<180>";
				this.m_Stop();
			}
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<182>";
			if(t_time<0){
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<184>";
				this.f_timeCurrent=0;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<185>";
				this.f_timeStart=bb_app_Millisecs();
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<186>";
				this.m_UpdateValue();
			}else{
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<189>";
				this.f_timeCurrent=t_time;
				err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<190>";
				this.m_UpdateValue();
			}
		}
	}
	pop_err();
	return 0;
}
var bb_tween_Tween_Expo;
bb_tween_Tween.prototype.m_SetEquation=function(t_equation){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<62>";
	dbg_object(this).f_equation=t_equation;
	pop_err();
	return 0;
}
function bb_tween_Tween_new(t_equation,t_startValue,t_endValue,t_duration){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<43>";
	this.m_SetEquation(t_equation);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<44>";
	this.m_SetDuration(t_duration);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<45>";
	this.m_SetValue(t_startValue,t_endValue);
	pop_err();
	return this;
}
function bb_tween_Tween_new2(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<11>";
	pop_err();
	return this;
}
bb_tween_Tween.prototype.m_Value=function(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<57>";
	pop_err();
	return this.f_current;
}
function bb_app_Millisecs(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/app.monkey<149>";
	var t_=bb_app_device.MilliSecs();
	pop_err();
	return t_;
}
function bb_tween_TweenEquationCall(){
	Object.call(this);
}
bb_tween_TweenEquationCall.prototype.m_Call=function(t_t,t_b,t_c,t_d){
}
function bb_tween_TweenEquationCall_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<207>";
	pop_err();
	return this;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<241>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<241>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<391>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<393>";
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_math_Max(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<56>";
	if(t_x>t_y){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<56>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<57>";
	pop_err();
	return t_y;
}
function bb_math_Max2(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<83>";
	if(t_x>t_y){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<83>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<84>";
	pop_err();
	return t_y;
}
function bb_math_Min(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<51>";
	if(t_x<t_y){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<51>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<52>";
	pop_err();
	return t_y;
}
function bb_math_Min2(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<78>";
	if(t_x<t_y){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<78>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<79>";
	pop_err();
	return t_y;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<368>";
	var t_ix2=t_ix*dbg_object(bb_graphics_context).f_ix+t_iy*dbg_object(bb_graphics_context).f_jx;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<369>";
	var t_iy2=t_ix*dbg_object(bb_graphics_context).f_iy+t_iy*dbg_object(bb_graphics_context).f_jy;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<370>";
	var t_jx2=t_jx*dbg_object(bb_graphics_context).f_ix+t_jy*dbg_object(bb_graphics_context).f_jx;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<371>";
	var t_jy2=t_jx*dbg_object(bb_graphics_context).f_iy+t_jy*dbg_object(bb_graphics_context).f_jy;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<372>";
	var t_tx2=t_tx*dbg_object(bb_graphics_context).f_ix+t_ty*dbg_object(bb_graphics_context).f_jx+dbg_object(bb_graphics_context).f_tx;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<373>";
	var t_ty2=t_tx*dbg_object(bb_graphics_context).f_iy+t_ty*dbg_object(bb_graphics_context).f_jy+dbg_object(bb_graphics_context).f_ty;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<374>";
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(t_m){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<364>";
	bb_graphics_Transform(dbg_array(t_m,0)[0],dbg_array(t_m,1)[1],dbg_array(t_m,2)[2],dbg_array(t_m,3)[3],dbg_array(t_m,4)[4],dbg_array(t_m,5)[5]);
	pop_err();
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<382>";
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<378>";
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	pop_err();
	return 0;
}
function bb_autofit_UpdateVirtualDisplay(t_zoomborders,t_keepborders){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<144>";
	bb_autofit_VirtualDisplay_Display.m_UpdateVirtualDisplay(t_zoomborders,t_keepborders);
	pop_err();
	return 0;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<347>";
	var t_sp=dbg_object(bb_graphics_context).f_matrixSp;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<348>";
	var t_=t_sp+0;
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_)[t_]=dbg_object(bb_graphics_context).f_ix
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<349>";
	var t_2=t_sp+1;
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_2)[t_2]=dbg_object(bb_graphics_context).f_iy
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<350>";
	var t_3=t_sp+2;
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_3)[t_3]=dbg_object(bb_graphics_context).f_jx
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<351>";
	var t_4=t_sp+3;
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_4)[t_4]=dbg_object(bb_graphics_context).f_jy
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<352>";
	var t_5=t_sp+4;
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_5)[t_5]=dbg_object(bb_graphics_context).f_tx
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<353>";
	var t_6=t_sp+5;
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_6)[t_6]=dbg_object(bb_graphics_context).f_ty
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<354>";
	dbg_object(bb_graphics_context).f_matrixSp=t_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_ValidateMatrix(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<234>";
	if((dbg_object(bb_graphics_context).f_matDirty)!=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<235>";
		dbg_object(bb_graphics_context).f_device.SetMatrix(dbg_object(bb_graphics_context).f_ix,dbg_object(bb_graphics_context).f_iy,dbg_object(bb_graphics_context).f_jx,dbg_object(bb_graphics_context).f_jy,dbg_object(bb_graphics_context).f_tx,dbg_object(bb_graphics_context).f_ty);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<236>";
		dbg_object(bb_graphics_context).f_matDirty=0;
	}
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<358>";
	var t_sp=dbg_object(bb_graphics_context).f_matrixSp-6;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<359>";
	var t_=t_sp+0;
	var t_2=t_sp+1;
	var t_3=t_sp+2;
	var t_4=t_sp+3;
	var t_5=t_sp+4;
	var t_6=t_sp+5;
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_)[t_],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_2)[t_2],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_3)[t_3],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_4)[t_4],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_5)[t_5],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_6)[t_6]);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<360>";
	dbg_object(bb_graphics_context).f_matrixSp=t_sp;
	pop_err();
	return 0;
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<454>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<456>";
	var t_f=dbg_array(dbg_object(t_image).f_frames,t_frame)[t_frame];
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<458>";
	if((dbg_object(bb_graphics_context).f_tformed)!=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<459>";
		bb_graphics_PushMatrix();
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<461>";
		bb_graphics_Translate(t_x-dbg_object(t_image).f_tx,t_y-dbg_object(t_image).f_ty);
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<463>";
		bb_graphics_ValidateMatrix();
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<465>";
		if((dbg_object(t_image).f_flags&65536)!=0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<466>";
			dbg_object(bb_graphics_context).f_device.DrawSurface(dbg_object(t_image).f_surface,0.0,0.0);
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<468>";
			dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,0.0,0.0,dbg_object(t_f).f_x,dbg_object(t_f).f_y,dbg_object(t_image).f_width,dbg_object(t_image).f_height);
		}
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<471>";
		bb_graphics_PopMatrix();
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<473>";
		bb_graphics_ValidateMatrix();
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<475>";
		if((dbg_object(t_image).f_flags&65536)!=0){
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<476>";
			dbg_object(bb_graphics_context).f_device.DrawSurface(dbg_object(t_image).f_surface,t_x-dbg_object(t_image).f_tx,t_y-dbg_object(t_image).f_ty);
		}else{
			err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<478>";
			dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,t_x-dbg_object(t_image).f_tx,t_y-dbg_object(t_image).f_ty,dbg_object(t_f).f_x,dbg_object(t_f).f_y,dbg_object(t_image).f_width,dbg_object(t_image).f_height);
		}
	}
	pop_err();
	return 0;
}
function bb_graphics_Rotate(t_angle){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<386>";
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<485>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<487>";
	var t_f=dbg_array(dbg_object(t_image).f_frames,t_frame)[t_frame];
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<489>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<491>";
	bb_graphics_Translate(t_x,t_y);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<492>";
	bb_graphics_Rotate(t_rotation);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<493>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<495>";
	bb_graphics_Translate(-dbg_object(t_image).f_tx,-dbg_object(t_image).f_ty);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<497>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<499>";
	if((dbg_object(t_image).f_flags&65536)!=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<500>";
		dbg_object(bb_graphics_context).f_device.DrawSurface(dbg_object(t_image).f_surface,0.0,0.0);
	}else{
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<502>";
		dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,0.0,0.0,dbg_object(t_f).f_x,dbg_object(t_f).f_y,dbg_object(t_image).f_width,dbg_object(t_image).f_height);
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<505>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_input_MouseDown(t_button){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/input.monkey<100>";
	var t_=bb_input_device.KeyDown(1+t_button);
	pop_err();
	return t_;
}
function bb_input_MouseY(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/input.monkey<96>";
	var t_=bb_input_device.MouseY();
	pop_err();
	return t_;
}
function bb_autofit_VMouseY(t_limit){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<164>";
	var t_=bb_autofit_VirtualDisplay_Display.m_VMouseY(t_limit);
	pop_err();
	return t_;
}
function bb_input_MouseX(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/input.monkey<92>";
	var t_=bb_input_device.MouseX();
	pop_err();
	return t_;
}
function bb_autofit_VMouseX(t_limit){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/autofit/autofit.monkey<160>";
	var t_=bb_autofit_VirtualDisplay_Display.m_VMouseX(t_limit);
	pop_err();
	return t_;
}
function bb_math_Abs(t_x){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<46>";
	if(t_x>=0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<46>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<47>";
	var t_=-t_x;
	pop_err();
	return t_;
}
function bb_math_Abs2(t_x){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<73>";
	if(t_x>=0.0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<73>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/math.monkey<74>";
	var t_=-t_x;
	pop_err();
	return t_;
}
function bb_graphics_DrawLine(t_x1,t_y1,t_x2,t_y2){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<414>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<416>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/mojo/graphics.monkey<417>";
	bb_graphics_renderDevice.DrawLine(t_x1,t_y1,t_x2,t_y2);
	pop_err();
	return 0;
}
var bb_random_Seed;
function bb_random_Rnd(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/random.monkey<21>";
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/random.monkey<22>";
	var t_=(bb_random_Seed>>8&16777215)/16777216.0;
	pop_err();
	return t_;
}
function bb_random_Rnd2(t_low,t_high){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/random.monkey<30>";
	var t_=bb_random_Rnd3(t_high-t_low)+t_low;
	pop_err();
	return t_;
}
function bb_random_Rnd3(t_range){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/monkey/random.monkey<26>";
	var t_=bb_random_Rnd()*t_range;
	pop_err();
	return t_;
}
function bb_tween_TweenEquation(){
	Object.call(this);
	this.f_EaseIn=null;
	this.f_EaseOut=null;
	this.f_EaseInOut=null;
}
function bb_tween_TweenEquation_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<200>";
	pop_err();
	return this;
}
function bb_tween_TweenEquationExpo(){
	bb_tween_TweenEquation.call(this);
}
bb_tween_TweenEquationExpo.prototype=extend_class(bb_tween_TweenEquation);
function bb_tween_TweenEquationExpo_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<517>";
	bb_tween_TweenEquation_new.call(this);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<518>";
	this.f_EaseIn=(bb_tween_TweenEquationCallExpoEaseIn_new.call(new bb_tween_TweenEquationCallExpoEaseIn));
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<519>";
	this.f_EaseOut=(bb_tween_TweenEquationCallExpoEaseOut_new.call(new bb_tween_TweenEquationCallExpoEaseOut));
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<520>";
	this.f_EaseInOut=(bb_tween_TweenEquationCallExpoEaseInOut_new.call(new bb_tween_TweenEquationCallExpoEaseInOut));
	pop_err();
	return this;
}
function bb_tween_TweenEquationCallExpoEaseIn(){
	bb_tween_TweenEquationCall.call(this);
}
bb_tween_TweenEquationCallExpoEaseIn.prototype=extend_class(bb_tween_TweenEquationCall);
function bb_tween_TweenEquationCallExpoEaseIn_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<524>";
	bb_tween_TweenEquationCall_new.call(this);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<524>";
	pop_err();
	return this;
}
bb_tween_TweenEquationCallExpoEaseIn.prototype.m_Call=function(t_t,t_b,t_c,t_d){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<526>";
	if(t_t==0.0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<526>";
		pop_err();
		return t_b;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<527>";
	var t_=t_c*Math.pow(2.0,10.0*(t_t/t_d-1.0))+t_b;
	pop_err();
	return t_;
}
function bb_tween_TweenEquationCallExpoEaseOut(){
	bb_tween_TweenEquationCall.call(this);
}
bb_tween_TweenEquationCallExpoEaseOut.prototype=extend_class(bb_tween_TweenEquationCall);
function bb_tween_TweenEquationCallExpoEaseOut_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<531>";
	bb_tween_TweenEquationCall_new.call(this);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<531>";
	pop_err();
	return this;
}
bb_tween_TweenEquationCallExpoEaseOut.prototype.m_Call=function(t_t,t_b,t_c,t_d){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<533>";
	if(t_t==t_d){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<533>";
		var t_=t_b+t_c;
		pop_err();
		return t_;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<534>";
	var t_2=t_c*(-Math.pow(2.0,-10.0*t_t/t_d)+1.0)+t_b;
	pop_err();
	return t_2;
}
function bb_tween_TweenEquationCallExpoEaseInOut(){
	bb_tween_TweenEquationCall.call(this);
}
bb_tween_TweenEquationCallExpoEaseInOut.prototype=extend_class(bb_tween_TweenEquationCall);
function bb_tween_TweenEquationCallExpoEaseInOut_new(){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<538>";
	bb_tween_TweenEquationCall_new.call(this);
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<538>";
	pop_err();
	return this;
}
bb_tween_TweenEquationCallExpoEaseInOut.prototype.m_Call=function(t_t,t_b,t_c,t_d){
	push_err();
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<540>";
	if(t_t==0.0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<540>";
		pop_err();
		return t_b;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<541>";
	if(t_t==t_d){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<541>";
		var t_=t_b+t_c;
		pop_err();
		return t_;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<542>";
	t_t/=t_d/2.0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<543>";
	if(t_t<1.0){
		err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<543>";
		var t_2=t_c/2.0*Math.pow(2.0,10.0*(t_t-1.0))+t_b;
		pop_err();
		return t_2;
	}
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<544>";
	t_t=t_t-1.0;
	err_info="C:/Users/Nibiru/Desktop/MonkeyPro54/modules/tween/tween.monkey<545>";
	var t_3=t_c/2.0*(-Math.pow(2.0,-10.0*t_t)+2.0)+t_b;
	pop_err();
	return t_3;
}
function bbInit(){
	bb_graphics_context=null;
	bb_input_device=null;
	bb_audio_device=null;
	bb_app_device=null;
	bb_graphics_Image_DefaultFlags=256;
	bb_graphics_renderDevice=null;
	bb_autofit_VirtualDisplay_Display=null;
	bb_random_Seed=1234;
	bb_tween_Tween_Expo=(bb_tween_TweenEquationExpo_new.call(new bb_tween_TweenEquationExpo));
}
//${TRANSCODE_END}
