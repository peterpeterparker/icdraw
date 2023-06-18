import type { User } from "@junobuild/core";

export type PostMessageDataRequest = {
  user: User | undefined | null;
};
export type PostMessageDataResponse = object;

export type PostMessageRequest = "start" | "stop";
export type PostMessageResponse = object;

export interface PostMessage<
  T extends PostMessageDataRequest | PostMessageDataResponse
> {
  msg: PostMessageRequest | PostMessageResponse;
  data?: T;
}
