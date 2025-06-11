import React from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

function SubmitBtn({ isLoading, text, loadingText }: { isLoading: boolean, text: string, loadingText: string }) {
    return (
        <Button type='submit' disabled={isLoading} className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} w-full`}>
            {isLoading ? (
                <>
                    <Loader2 className='mr-2 animate-spin' size={500} />
                    {loadingText}
                </>
            ) : (
                <>
                    {text}
                </>
            )}
        </Button>
    )
}

export default SubmitBtn

