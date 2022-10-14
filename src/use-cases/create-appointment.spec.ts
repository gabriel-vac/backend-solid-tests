import { describe, expect, it } from 'vitest';
import { Appointment } from '../entities/appointments';
import { getFutureDate } from '../tests/utils/get-future-date';
import { CreateAppointment } from './create-appointment';
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments.repository';

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const startsAt = getFutureDate('2022-08-10');
    const endsAt = getFutureDate('2022-08-11');

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt,
        endsAt,
      }),
    ).resolves.toBeInstanceOf(Appointment);
  });

  it('should not be able to create an appointment with overlapping dates', async () => {
    const startsAt = getFutureDate('2022-08-10');
    const endsAt = getFutureDate('2022-08-15');

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt,
    });

    //Starts after and ends after
    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-14'),
        endsAt: getFutureDate('2022-08-18'),
      }),
    ).rejects.toBeInstanceOf(Error);

    //Starts before and ends between
    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-08'),
        endsAt: getFutureDate('2022-08-12'),
      }),
    ).rejects.toBeInstanceOf(Error);

    //starts before and ends after
    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-08'),
        endsAt: getFutureDate('2022-08-17'),
      }),
    ).rejects.toBeInstanceOf(Error);

    //starts after and ends between
    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2022-08-11'),
        endsAt: getFutureDate('2022-08-12'),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
