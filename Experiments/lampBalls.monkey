Import mojo
Import monkey
Import monkey.math

Class Ball

	Public
	Field x#, y#, size#
	Private
	Field cSize#, d#
	
	
	Method New( x#, y#, size# )
		Self.x = x
		Self.y = y
		Self.size = size
	End
	
	Method Update( mX#, mY# )
		d = Sqrt( Pow( mY - y, 2 ) + Pow( mX - x, 2 ) ) + size
		cSize = size + 500 / d
	End
	
	Method Paint( )
		DrawCircle( x, y, cSize )
	End
	
End

Class LampBalls Extends App
	
	Field balls:List< Ball >
	
	Method OnCreate( )
		
		Seed = Millisecs( )
        SetUpdateRate( 60 )
		balls = New List< Ball >
		For Local i# = 0 Until 1000 Step 1
			balls.AddLast( New Ball(  Rnd( 640 ), Rnd( 480 ), 18 ) )
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
		SetAlpha( 0.2 )
		For Local ball:Ball = Eachin balls
			ball.Paint
		Next
    End

End

Function Main()
    New LampBalls
End

