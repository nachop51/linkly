import { useState } from 'react'
import type { KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import BadgeClosable from '@/components/common/closable-badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function ShortenForm() {
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')

  const addTag = () => {
    const value = tagInput.trim()

    if (!value || tags.includes(value)) return

    setTags((prevTags) => [...prevTags, value])
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label htmlFor="longUrl">
          Long URL<span className="text-red-500">*</span>
        </Label>
        <Input
          id="longUrl"
          name="longUrl"
          type="url"
          placeholder="https://example.com/very/long/url"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="alias">Alias</Label>
        <div className="flex">
          <Input
            id="alias"
            name="alias"
            type="text"
            placeholder="my-custom-link"
            className="rounded-r-none"
          />
          <span className="inline-flex h-8 items-center border border-l-0 border-input bg-muted px-2.5 text-xs text-muted-foreground">
            link.ly
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Visibility</Label>

        <RadioGroup
          value={visibility}
          onValueChange={(value) =>
            setVisibility(value as 'public' | 'private')
          }
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Private</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <BadgeClosable key={tag} onClick={() => removeTag(tag)}>
                {tag}
              </BadgeClosable>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Tell us what this link is for..."
          className="w-full rounded-none border border-input bg-transparent px-2.5 py-2 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
      </div>

      <Button type="submit" className="w-full">
        Shorten
      </Button>
    </form>
  )
}
