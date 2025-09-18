import React from 'react'
import ChatWindow from '../components/Chat/ChatWindow'
import ParticipantSidebar from '../components/Common/ParticipantSidebar'

export default function Chat() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <ChatWindow roomId="world" />
                </div>
                <ParticipantSidebar participants={[]} onAction={(a,p)=>console.log(a,p)} />
            </div>
        </div>
    )
}
