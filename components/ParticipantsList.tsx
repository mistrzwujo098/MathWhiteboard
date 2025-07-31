'use client'

interface ParticipantsListProps {
  participants: any[]
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Participants:</span>
      <div className="flex -space-x-2">
        {participants.slice(0, 5).map((participant) => (
          <div
            key={participant.id}
            className="w-8 h-8 rounded-full bg-math-primary text-white flex items-center justify-center text-xs font-medium border-2 border-white"
            title={participant.profiles?.display_name || 'Unknown'}
          >
            {(participant.profiles?.display_name || 'U').charAt(0).toUpperCase()}
          </div>
        ))}
        {participants.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
            +{participants.length - 5}
          </div>
        )}
      </div>
      <span className="text-sm text-gray-600">({participants.length})</span>
    </div>
  )
}