import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodePoem } from '../models/poem.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'code_poems';
  private poems: CodePoem[] = [];
  private poemsSubject = new BehaviorSubject<CodePoem[]>([]);

  constructor() {
    this.loadPoems();
  }

  getAllPoems(): Observable<CodePoem[]> {
    return this.poemsSubject.asObservable();
  }

  getPoem(id: string): CodePoem | undefined {
    return this.poems.find(poem => poem.id === id);
  }

  savePoem(poem: CodePoem): void {
    // Check if poem already exists (for updates)
    const index = this.poems.findIndex(p => p.id === poem.id);
    
    if (index >= 0) {
      // Update existing poem
      this.poems[index] = { ...poem };
    } else {
      // Add new poem
      this.poems.push(poem);
    }
    
    this.savePoems();
  }

  deletePoem(id: string): void {
    this.poems = this.poems.filter(poem => poem.id !== id);
    this.savePoems();
  }

  likePoem(id: string): void {
    const index = this.poems.findIndex(p => p.id === id);
    if (index >= 0) {
      this.poems[index] = { 
        ...this.poems[index], 
        likes: (this.poems[index].likes || 0) + 1 
      };
      this.savePoems();
    }
  }

  private loadPoems(): void {
    try {
      const storage = localStorage.getItem(this.STORAGE_KEY);
      if (storage) {
        this.poems = JSON.parse(storage);
        this.poemsSubject.next([...this.poems]);
      }
    } catch (error) {
      console.error('Error loading poems from storage', error);
    }
  }

  private savePoems(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.poems));
      this.poemsSubject.next([...this.poems]);
    } catch (error) {
      console.error('Error saving poems to storage', error);
    }
  }
}