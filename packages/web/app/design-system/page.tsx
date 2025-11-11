import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Flame, Calendar, Plus } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">FocusPulse</h1>
          <p className="text-zinc-400 text-lg">Design System</p>
        </div>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Color Palette</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            FocusPulse uses OKLCH color space with a dark-first approach and zinc-based neutrals.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-24 bg-background border border-zinc-800 rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-zinc-500">oklch(0.145 0 0)</p>
            </div>
            <div>
              <div className="h-24 bg-card border border-zinc-800 rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Card</p>
              <p className="text-xs text-zinc-500">oklch(0.205 0 0)</p>
            </div>
            <div>
              <div className="h-24 bg-primary rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-zinc-500">oklch(0.922 0 0)</p>
            </div>
            <div>
              <div className="h-24 bg-destructive rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-zinc-500">oklch(0.577 0.245 27.325)</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Neutral Scale (Zinc)</p>
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-zinc-950 rounded flex items-center justify-center text-xs">950</div>
              <div className="flex-1 h-12 bg-zinc-900 rounded flex items-center justify-center text-xs">900</div>
              <div className="flex-1 h-12 bg-zinc-800 rounded flex items-center justify-center text-xs">800</div>
              <div className="flex-1 h-12 bg-zinc-700 rounded flex items-center justify-center text-xs">700</div>
              <div className="flex-1 h-12 bg-zinc-600 rounded flex items-center justify-center text-xs">600</div>
              <div className="flex-1 h-12 bg-zinc-500 rounded flex items-center justify-center text-xs">500</div>
              <div className="flex-1 h-12 bg-zinc-400 rounded flex items-center justify-center text-xs text-black">400</div>
              <div className="flex-1 h-12 bg-zinc-300 rounded flex items-center justify-center text-xs text-black">300</div>
              <div className="flex-1 h-12 bg-zinc-200 rounded flex items-center justify-center text-xs text-black">200</div>
              <div className="flex-1 h-12 bg-zinc-100 rounded flex items-center justify-center text-xs text-black">100</div>
              <div className="flex-1 h-12 bg-zinc-50 rounded flex items-center justify-center text-xs text-black">50</div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Typography</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Using Geist Sans and Geist Mono for a modern, readable interface.
          </p>

          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">Heading 1</h1>
              <code className="text-xs text-zinc-500">text-5xl font-bold</code>
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
              <code className="text-xs text-zinc-500">text-3xl font-semibold</code>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
              <code className="text-xs text-zinc-500">text-2xl font-semibold</code>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Heading 4</h4>
              <code className="text-xs text-zinc-500">text-lg font-semibold</code>
            </div>
            <div>
              <p className="text-sm mb-2">Body text - The quick brown fox jumps over the lazy dog</p>
              <code className="text-xs text-zinc-500">text-sm</code>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-2">Helper text - Additional information</p>
              <code className="text-xs text-zinc-500">text-xs text-zinc-400</code>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Spacing */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Spacing</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Consistent spacing using Tailwind's 4px-based scale.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-zinc-400">gap-1</div>
              <div className="flex gap-1">
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
              </div>
              <code className="text-xs text-zinc-500">0.25rem (4px)</code>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-zinc-400">gap-2</div>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
              </div>
              <code className="text-xs text-zinc-500">0.5rem (8px)</code>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-zinc-400">gap-4</div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
              </div>
              <code className="text-xs text-zinc-500">1rem (16px)</code>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm text-zinc-400">gap-6</div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                <div className="w-12 h-12 bg-zinc-800 rounded"></div>
              </div>
              <code className="text-xs text-zinc-500">1.5rem (24px)</code>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Buttons</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Button variants for different actions and hierarchy.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Badges</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Inline labels for status and categories.
          </p>

          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Cards</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Container component for grouping related content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>
                  A brief description of the card content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  This is the main content area of the card where you can place any information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-zinc-400" />
                    With Icon
                  </CardTitle>
                  <Badge>Active</Badge>
                </div>
                <CardDescription>
                  Card with icon and badge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">1,234</div>
                <p className="text-xs text-zinc-500 mt-1">Metric value</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Form Inputs */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Form Inputs</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Input components for user interaction.
          </p>

          <div className="max-w-md space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Default Input</label>
              <Input placeholder="Enter text..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Disabled Input</label>
              <Input placeholder="Disabled" disabled />
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Icons */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Icons</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Using Lucide React icons throughout the application.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-8 w-8 text-zinc-400" />
              <span className="text-xs text-zinc-500">Clock</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-zinc-400" />
              <span className="text-xs text-zinc-500">CheckCircle</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Flame className="h-8 w-8 text-zinc-400" />
              <span className="text-xs text-zinc-500">Flame</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-8 w-8 text-zinc-400" />
              <span className="text-xs text-zinc-500">Calendar</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Plus className="h-8 w-8 text-zinc-400" />
              <span className="text-xs text-zinc-500">Plus</span>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Design Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Design Principles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dark-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  A professional dark interface optimized for focus and reduced eye strain during extended use.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consistent Spacing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  4px-based spacing system for predictable and harmonious layouts across all components.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subtle Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  Smooth transitions and hover states that enhance usability without distraction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accessibility First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  High contrast ratios, proper semantic HTML, and keyboard navigation support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
          <p>Built with Next.js, Tailwind CSS 4, and ShadCN UI</p>
        </div>
      </div>
    </div>
  );
}
