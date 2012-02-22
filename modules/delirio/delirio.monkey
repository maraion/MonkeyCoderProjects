Import mojo
Import monkey
Import monkey.math
Import delta

Class DEGameState

	Public
	Field name:String
	Field isRunning:Bool = False
	
	Private
	Field gameMachine:DEGameMachine
	
	Method New( name:String, gMachine:DEGameMachine )
		Self.name = name
		gameMachine = gMachine
		gameMachine.AddState( name, Self )
	End
	
	Method Update( dt:Float  )
	End
	
	Method Update( )
		Update( 1.0 )
	End
	
	Method Render( )
	End
	
	Method Start( )
		isRunning = True
	End
	
	Method Resume( )
		isRunning = True
	End
	
	Method Finish( )
		isRunning = False
	End
End

Class DEGameMachine Extends DEGameState
	Public
	Field states:StringMap< DEGameState >
	Field current:DEGameState
	Field initialState:DEGameState
	Field deltaTimer:DeltaTimer
	
	Method New( )
		Super.New
		states = New StringMap< DEGameState >
		
		deltaTimer = New DeltaTimer( 60 )
	End
	
	Method Start( )
		If initialState Then
			Super.Start
			current = initialState
			initialState.Start
		End
	End
	
	Method AddState( name:String, state:DEGameState )
		states.Add( name, state )
		If Not initialState Then
			initialState = state
		End 
	End
	
	Method SetInitialState( state:DEGameState )
		initialState = state
	End
	
	Method Goto( state: String )
		If Not isRunning Then Return
	End
	
	Method Restart( )
		
	End
	
	Method Update( )
		If Not isRunning Then Return
		deltaTimer.UpdateDelta
		current.Update( 0 )'deltaTimer.delta )
	End
	
	Method Render( )
		If Not isRunning Then Return
		current.Render( )
	End
	
	Method Pause( )
		Super.Pause
		
	End
	
	Method Finish( )
		Super.Finish
	End
	
End
