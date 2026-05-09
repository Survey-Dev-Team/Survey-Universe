package com.survey.universe.api.web.dto.response;

import java.util.List;

public record PagedResponseDto<T>(List<T> content, int currentPage, int totalPages, long totalElements,
		boolean hasNext) {
}
