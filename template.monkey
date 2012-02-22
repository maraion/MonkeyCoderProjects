Import mojo
Import monkey

Import autofit
Import delta
Import tween

Class Game Extends App
	Field aspectRatio:Float
	
	Method OnCreate( )
		Super.OnCreate
		
		SetVirtualDisplay 320,480
		
		aspectRatio = DeviceWidth / DeviceHeight
		Print DeviceWidth + " x " + DeviceHeight + " ratio " + aspectRatio
		
		SetUpdateRate 60
	End
	
	Method OnUpdate( )
		Super.OnUpdate
	
	End
	
	Method OnRender( )
		UpdateVirtualDisplay
		
		SetColor 255, 0, 0
		DrawRect 0, 0, VDeviceWidth, VDeviceHeight

		
	End
	
End

Function Main( )
	New Game
End
