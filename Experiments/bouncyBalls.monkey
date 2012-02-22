Import mojo
Import monkey
Import monkey.math

Class Ball

	Private
	Field dx#, dy#
	
	Public
	Field x#, y#, size#, vx#, vy#
	
	Method New( x#, y#, vx#, vy#, size# )
		Self.x = x
		Self.y = y		
		Self.size = size	
		Self.vx = vx
		Self.vy = vy
	End
	
	Method Update( mX#, mY# )
		dx = x + vx
		dy = y + vy
				
		If( dx < 0 ) Then vx = Rnd( 12 ) 
		If( dy < 0 ) Then vy = Rnd( 12 )

		If( dx > 640 ) Then vx = - Rnd( 12 )
		If( dy > 480 ) Then vy = - Rnd( 12 )
		
		x = x + vx
		y = y + vy		
	End
	
	Method Paint( )
		DrawCircle( x, y, size )
	End
		
End

Class BouncyBalls Extends App
	
	Field balls:List< Ball >
	
	Method OnCreate( )		
		Seed = Millisecs( )		
        SetUpdateRate( 60 )

		balls = New List< Ball >
		For Local i# = 0 Until 3000 Step 1
			balls.AddLast( New Ball(  Rnd( 640 ), Rnd( 480 ), Rnd( -10, 10 ), Rnd( -10, 10 ), Rnd( 5, 25 ) ) )
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
		SetColor( 200, 12, 12 )
		SetAlpha( 0.05 )
		For Local ball:Ball = Eachin balls
			ball.Paint
		Next
    End

End

Function Main()
    New BouncyBalls
End

