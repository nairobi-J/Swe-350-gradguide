
interface ButtonProps{
    children: React.ReactNode
    onClick?: ()=>void
    //variant?: 'primary'|'secondary'|'outline'
}

const Button = ({ children, onClick}: ButtonProps)=>{

    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
    }

    return(
        <button className="text-8xl bg-amber-400" onClick={onClick}>{children}</button>
    )
}

export default Button;