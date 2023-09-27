"use client"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const PostForm = ({}: {}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Төлбөрийн барasdsимт авах</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <Button type="submit" className="font-semibold">
          Баримт хэвлэхdadas
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default PostForm
