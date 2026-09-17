import type { UserResponse } from '@/shared/models/api/user.type';

import type { UserSearchState } from '../types/userSearch.type';

export class UserSearchModel {
  private state: UserSearchState = {
    query: '',
    users: [],
    selectedIds: [],
    didSearch: false,
  };

  public getQuery(): string {
    return this.state.query;
  }

  public setQuery(query: string): void {
    this.state.query = query;
  }

  public getUsers(): UserResponse[] {
    return this.state.users;
  }

  public setUsers(users: UserResponse[]): void {
    this.state.users = users;
  }

  public getError(): string | undefined {
    return this.state.error;
  }

  public setError(error?: string): void {
    this.state.error = error;
  }

  public getDidSearch(): boolean {
    return this.state.didSearch;
  }

  public setDidSearch(didSearch: boolean): void {
    this.state.didSearch = didSearch;
  }

  public getSelectedIds(): number[] {
    return this.state.selectedIds;
  }

  public isSelected(userId: number): boolean {
    return this.state.selectedIds.includes(userId);
  }

  public toggleSelected(userId: number): void {
    if (this.isSelected(userId)) {
      this.state.selectedIds = this.state.selectedIds.filter((id) => id !== userId);
      return;
    }

    this.state.selectedIds = [...this.state.selectedIds, userId];
  }

  public clearSelected(): void {
    this.state.selectedIds = [];
  }
}
