Import mojo
Import monkey
Import monkey.math

Import autofit
Import delta
Import tween

Const DEBUG:=False

Class Game Extends App
	Public
	Field aspectRatio:Float
	Field bottleImage:Image
	Field backgroundImage:Image
	Field rotation:Float = 90
	Field centerX:Float, centerY:Float
	Field direction:Int = 0 'Clockise
	
	Private
	Field tmpRot:Float
	Field tweenRotation:Tween
	Field rotating:Bool = False
	
	Method OnCreate( )
		Super.OnCreate
		
		SetVirtualDisplay( 320, 480 )
		aspectRatio = DeviceWidth / DeviceHeight
		
		centerX = VDeviceWidth / 2
		centerY = VDeviceHeight / 2
		
		bottleImage = LoadImage( "bottle.png", 1 , Image.MidHandle )
		backgroundImage = LoadImage( "background.png", 1 , Image.MidHandle )
		
		SetUpdateRate 60
	End
	
	Method OnUpdate( )
		Super.OnUpdate
		If tweenRotation Then tweenRotation.Update( )
	End
	
	Method OnRender( )
		UpdateVirtualDisplay

		DrawImage( backgroundImage, VDeviceWidth / 2, VDeviceHeight / 2 )
		
		If MouseDown Then
			If rotating Then
				rotating = False
				direction = 0
			End
			tmpRot = Abs( ATan( ( VMouseY - centerY  ) / ( VMouseX - centerX ) ) )
			
			'II
			If VMouseX < centerX And VMouseY < centerY Then
				tmpRot = 180 - tmpRot
			'III
			Elseif VMouseX < centerX And VMouseY > centerY Then
				tmpRot = 180 + tmpRot
			'IV
			Elseif VMouseX > centerX And VMouseY > centerY Then
				tmpRot = 360 - tmpRot
			End
			
			If tmpRot < 45 And rotation > 315 Then
				direction += 360 + tmpRot - rotation
			Else
				direction += tmpRot - rotation
			End
			
			If rotation < tmpRot Then
				direction = 1
			Else
				direction = -1
			End
			
			rotation = tmpRot
			If DEBUG Then DrawLine( VMouseX, VMouseY , centerX, centerY )
			
		Elseif( direction <> 0 And Not rotating )
			If DEBUG Then Print( "Tween " + rotation + " " + direction )
			rotating = True
			If tweenRotation Then tweenRotation.Stop
			
			Local spin = rotation + Rnd( 480, 1080 ) * direction
			Local time = Abs( spin - rotation ) / 360 * 4500
			
			tweenRotation = New Tween( Tween.Expo.EaseOut, rotation, spin, time )
			tweenRotation.Start( )
		End
		
		If rotating Then rotation = tweenRotation.Value( )
		
		DrawImage( bottleImage, VDeviceWidth / 2, VDeviceHeight / 2, rotation - 90, 1, 1 )
		
	End
End

Function Main( )
	New Game
End
