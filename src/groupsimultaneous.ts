import Bacon from "./core";
import { when_ } from "./when";
import { BufferingSource } from "./source";
import { Desc, withDesc } from "./describe";
import EventStream, { Options } from "./eventstream";
import _ from "./_"
import Observable from "./observable";
import { argumentsToObservables } from "./argumentstoobservables";

export default function groupSimultaneous<V>(...streams: (Observable<V> | Observable<V>[])[]): EventStream<V[]> {
  return groupSimultaneous_(argumentsToObservables(streams))
}

export function groupSimultaneous_<V>(streams: Observable<V>[], options?: Options): EventStream<V[]> {
  let sources = _.map(stream => new BufferingSource<V>(stream), streams)

  let ctor = (desc, subscribe) => new EventStream(desc, subscribe, undefined, options)
  return withDesc(new Desc(Bacon, "groupSimultaneous", streams), when_(ctor, [sources, (function(...xs) { return xs; })]));
}

Bacon.groupSimultaneous = groupSimultaneous;
