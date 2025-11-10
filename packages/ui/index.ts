// UI Components
import { capitalize } from '@focuspulse/utils';

export function Button(text: string): string {
  return `<button>${capitalize(text)}</button>`;
}

export function Card(title: string, content: string): string {
  return `
    <div class="card">
      <h2>${capitalize(title)}</h2>
      <p>${content}</p>
    </div>
  `;
}

export function Alert(message: string, type: 'info' | 'warning' | 'error' = 'info'): string {
  return `<div class="alert alert-${type}">${message}</div>`;
}