export const toast = {
    title: (title: string) => {
      console.log(`Toast: ${title}`)
    },
    description: (description: string) => {
      console.log(`Toast description: ${description}`)
    },
    variant: (variant: string) => {
      console.log(`Toast variant: ${variant}`)
    },
  }
  
  export const useToast = () => {
    return {
      toast: (options: any) => {
        console.log("Toast:", options)
      },
    }
  }
  