export class AccountIdAlreadyExistsException extends Error {
  message: string =
    'This user id was previously registered on listen2it, cannot use it again';
}
