Import mojo
Import monkey
'LIBRARIES
Import autofit
Import delta
Import tween
Import delirio

Class SplashScreenA Extends DEGameState
	Method New( gMachine:DEGameMachine )
		Super.New( "splash", gMachine )
	End
	
	Method Update( dt:Float )
		Super.Update( )
		'Print dt
	End
	
End

Class Game Extends App
	Field aspectRatio:Float
	Field gameMachine:DEGameMachine
	
	Field splash:SplashScreenA
	
	Method OnCreate( )
		Super.OnCreate
		
		SetVirtualDisplay 320,480
		
		aspectRatio = DeviceWidth / DeviceHeight
		Print DeviceWidth + " x " + DeviceHeight + " ratio " + aspectRatio
		
		SetUpdateRate 60
		
		
		gameMachine = New DEGameMachine
		
		
		splash = New SplashScreenA( gameMachine )
		
		
		gameMachine.Start
		
		
	End
	
	Method OnUpdate( )
		Super.OnUpdate
		gameMachine.Update( )
	
	End
	
	Method OnRender( )
		UpdateVirtualDisplay
		
		SetColor 255, 0, 0
		DrawRect 0, 0, VDeviceWidth, VDeviceHeight


		'gameMachine.Render( )
		
	End
	
End

Function Main( )
	New Game
End
