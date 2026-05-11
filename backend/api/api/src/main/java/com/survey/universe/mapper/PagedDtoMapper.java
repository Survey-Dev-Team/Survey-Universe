package com.survey.universe.mapper;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.survey.universe.web.dto.generic.PagedResponseDto;

@Component
public class PagedDtoMapper {

	public <T, R> PagedResponseDto<R> toPagedResponse(List<T> items, Comparator<T> comparator, int page, int size,
			Function<T, R> mapper) {
		int totalElements = items.size();

		if (size == 0) {
			List<R> content = items.stream().sorted(comparator).map(mapper).toList();
			return new PagedResponseDto<>(content, 0, 1, totalElements, false);
		}

		int totalPages = (int) Math.ceil((double) totalElements / size);
		boolean hasNext = page < totalPages - 1;

		List<T> pagedItems = items.stream().sorted(comparator).skip((long) page * size).limit(size).toList();

		List<R> content = pagedItems.stream().map(mapper).toList();

		return new PagedResponseDto<>(content, page, totalPages, totalElements, hasNext);
	}
}
