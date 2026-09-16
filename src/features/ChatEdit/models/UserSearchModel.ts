import type { UserResponse } from '@/shared/models/api/user.type';

import type { UserSearchState } from '../types/userSearch.type';

export class UserSearchModel {
  private state: UserSearchState = {
    query: '',
    users: [],
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
}
