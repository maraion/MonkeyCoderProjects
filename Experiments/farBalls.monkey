Import mojo
Import tween
Import monkey
Import monkey.math

Class Ball

	Private
	Field signX#, signY#, m#, d#, deltaX#, deltaY#, vx#, vy#	
	
	Public
	Field x#, y#, size#
	
	Method New( x#, y#, size# )
		Self.x = x
		Self.y = y
		Self.size = size
	End
	
	Method Update( mX#, mY# )		
		If mX > x Then signX = 1 Else signX = -1		
		If mY > y Then signY = 1 Else signY = -1
		
		deltaX = Abs( mX - x )
		deltaY = Abs( mY - y )
		
		m = ATan( deltaY / deltaX )		
		d = Sqrt( Pow( deltaX, 2 ) + Pow( deltaY, 2 ) ) / 50

		If d > 0.02 Then 
			vx	= (  ( Cos( m )  ) * signX ) / d
			vy	= ( ( Sin( m )  ) * signY ) / d
			x = x + vx
			y = y + vy 
		Else
			x = Rnd( 640 )
			y = Rnd( 480 )			
		Endif		
	End
	
	Method Paint( )
		DrawCircle( x, y, size )
	End
	
End

Class FarBalls Extends App
	
	Field balls:List< Ball >
	
	Method OnCreate( )
		
		Seed = Millisecs( )
		
        SetUpdateRate( 60 )

		balls = New List< Ball >
		For Local i# = 0 Until 5000 Step 1
			balls.AddLast( New Ball(  Rnd( 640 ), Rnd( 480 ), 5 ) )
		End
    End

    Method OnUpdate( )
		For Local ball:Ball = Eachin balls
			ball.Update( MouseX, MouseY )
		Next
    End

    Method OnRender( )
		Cls
		SetBlend( AdditiveBlend)
		SetColor( 60, 60, 60 )
		SetAlpha( 0.6 )
		For Local ball:Ball = Eachin balls
			ball.Paint
		Next
    End

End

Function Main()
    New FarBalls
End
