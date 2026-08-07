/**
 * The generic DTO → ViewModel mapping contract every module's own
 * mapper implements. Per `development/ARCHITECTURE.md`, no component
 * should depend on a backend DTO type directly — a page reads a
 * ViewModel shape, produced by one of these mappers from the raw API
 * response.
 *
 * Infrastructure only for this phase — see the per-module mapper files
 * in this folder for what's implemented vs. deferred.
 */

export type Mapper<TDto, TViewModel> = (dto: TDto) => TViewModel

export function mapList<TDto, TViewModel>(dtos: TDto[], mapper: Mapper<TDto, TViewModel>): TViewModel[] {
  return dtos.map(mapper)
}

export function mapNullable<TDto, TViewModel>(
  dto: TDto | null | undefined,
  mapper: Mapper<TDto, TViewModel>,
): TViewModel | null {
  return dto === null || dto === undefined ? null : mapper(dto)
}
